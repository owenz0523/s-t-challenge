import json
import openai
import os
from dotenv import load_dotenv
from datetime import date, datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from load_data import DinersList, Diner

load_dotenv()

@dataclass
class Profile:
    name: str
    date: str
    people: int
    
    dietary_restrictions: List[str]
    allergies: List[str]
    special_occassion: str
    priority: str 
    special_requests: List[str]
    staff_notes: str
    conversation: List[str]
    
    def to_dict(self):
        return asdict(self)


class Processor:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def analyze_diner(self, diner: Diner) -> List[Profile]:
        profiles = []
        
        if not diner.reservations:
            return profiles
            
        for reservation in diner.reservations:
            # Create the prompt with all available diner history
            prompt = self._create_analysis_prompt(diner, reservation)
            
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": self._get_system_prompt()},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1
                )
                
                profile = self._parse_llm_response(
                    response.choices[0].message.content,
                    diner.name,
                    reservation.date.strftime("%Y-%m-%d"),
                    reservation.number_of_people
                )
                
                if profile:
                    profiles.append(profile)
                    
            except Exception as e:
                print(f"Error analyzing diner {diner.name}: {e}")
                profiles.append(self._create_fallback_profile(diner, reservation))
                
        return profiles

    def _get_system_prompt(self) -> str:
        return """You are an AI assistant helping a fine-dining restaurant prepare for their morning huddle. 
        Your job is to analyze guest history and extract actionable insights for front-of-house staff.

        Based on the guest's reviews, previous reservations, and email communications, identify:
        1. Dietary restrictions and allergies (be specific)
        2. Special occasions (birthdays, anniversaries, celebrations, etc.)
        3. VIP status (Regular visitor, First-time, VIP based on spending/loyalty)
        4. Special requests or accommodation needs
        5. Important staff notes (preferences, dislikes, accessibility needs)
        6. Conversation topics (interests, personal details staff should remember)

        Respond in JSON format with these exact keys:
        {
            "dietary_restrictions": ["list of dietary restrictions"],
            "allergies": ["list of specific allergies"],
            "special_occassion": "description of any special occasion or empty string",
            "priority": "VIP|Regular|First-time",
            "special_requests": ["list of special requests"],
            "staff_notes": "important notes for staff to remember",
            "conversation": ["topics staff can discuss with guest"]
        }"""

    def _create_analysis_prompt(self, diner: Diner, reservation) -> str:
        prompt = f"""
        Guest Name: {diner.name}
        Upcoming Reservation: {reservation.date} for {reservation.number_of_people} people

        === GUEST HISTORY ===
        """
        
        if diner.reviews:
            prompt += "\n--- REVIEWS ---\n"
            for review in diner.reviews:
                prompt += f"Date: {review.date}\n"
                prompt += f"Restaurant: {review.restaurant_name}\n"
                prompt += f"Rating: {review.rating}/5\n"
                prompt += f"Review: {review.content}\n\n"
        
        if diner.reservations:
            prompt += "--- PREVIOUS RESERVATIONS ---\n"
            for prev_res in diner.reservations:
                if prev_res.date < reservation.date:  # Only past reservations
                    prompt += f"Date: {prev_res.date}, People: {prev_res.number_of_people}\n"
                    for order in prev_res.orders:
                        prompt += f"  - {order.item} (${order.price}) - Tags: {order.dietary_tags}\n"
                    prompt += "\n"
        
        if diner.emails:
            prompt += "--- EMAIL COMMUNICATIONS ---\n"
            for email in diner.emails:
                prompt += f"Date: {email.date}\n"
                prompt += f"Subject: {email.subject}\n"
                prompt += f"Content: {email.combined_thread}\n\n"
        
        prompt += "\nPlease analyze this guest's history and provide insights for the upcoming reservation."
        
        return prompt

    def _parse_llm_response(self, response: str, name: str, date: str, people: int) -> Optional[Profile]:
        try:
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                return None
                
            json_str = response[start_idx:end_idx]
            data = json.loads(json_str)
            
            return Profile(
                name=name,
                date=date,
                people=people,
                dietary_restrictions=data.get("dietary_restrictions", []),
                allergies=data.get("allergies", []),
                special_occassion=data.get("special_occassion", ""),
                priority=data.get("priority", "Regular"),
                special_requests=data.get("special_requests", []),
                staff_notes=data.get("staff_notes", ""),
                conversation=data.get("conversation", [])
            )
            
        except Exception as e:
            print(f"Error parsing LLM response for {name}: {e}")
            return None

    def _create_fallback_profile(self, diner: Diner, reservation) -> Profile:
        dietary_restrictions = []
        allergies = []
        
        # Extract basic dietary info from reservation orders
        for order in reservation.orders:
            dietary_restrictions.extend(order.dietary_tags)
        
        # Check emails for obvious allergies/restrictions
        if diner.emails:
            for email in diner.emails:
                content = email.combined_thread.lower()
                if "allergy" in content or "allergic" in content:
                    # Try to extract the allergen
                    words = content.split()
                    for i, word in enumerate(words):
                        if word in ["allergy", "allergic"] and i > 0:
                            potential_allergen = words[i-1]
                            allergies.append(potential_allergen)
        
        return Profile(
            name=diner.name,
            date=reservation.date.strftime("%Y-%m-%d"),
            people=reservation.number_of_people,
            dietary_restrictions=list(set(dietary_restrictions)),
            allergies=allergies,
            special_occassion="",
            priority="Regular",
            special_requests=[],
            staff_notes="",
            conversation=[]
        )

    def process_all_diners(self, diners_list: DinersList) -> List[Profile]:
        all_profiles = []
        
        for diner in diners_list.diners:
            print(f"Analyzing diner {diner.name}")
            profiles = self.analyze_diner(diner)
            all_profiles.extend(profiles)
        
        return all_profiles

    def save_insights(self, profiles: List[Profile], output_file: str):
        data = {
            "generated_at": datetime.now().isoformat(),
            "total_reservations": len(profiles),
            "vip_count": len([p for p in profiles if p.priority == "VIP"]),
            "dietary_count": len([p for p in profiles if p.dietary_restrictions or p.allergies]),
            "special_occasion_count": len([p for p in profiles if p.special_occassion]),
            "profiles": [profile.to_dict() for profile in profiles]
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Saved {len(profiles)} guest profiles to {output_file}")


def main():
    # Load the raw data
    print("Loading diner data...")
    diners_list = DinersList.load_from_json("fine-dining-dataset.json")
    print(f"Loaded {len(diners_list.diners)} diners")
    
    # Process and analyze
    print("Analyzing guest histories...")
    processor = Processor()
    profiles = processor.process_all_diners(diners_list)
    
    # Save insights
    print("Saving insights...")
    processor.save_insights(profiles, "output.json")


if __name__ == "__main__":
    main()
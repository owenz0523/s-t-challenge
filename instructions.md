## Context

ShowAndTell is building the future of practice operations and patient interaction in dental. With the rapid development of language model capabilities, non-care activities require less and less staff attention. This technology not only streamlines practice operations but also opens up entirely new ways to personalize the patient experience. 

Our agents multiply a practice’s workforce and help them deliver exceptional care—both in-and-out of the office.

---

*At ShowAndTell, product engineers:*

- *Own end-to-end applied AI products and workflows*
- *Re-invent how patients engage with their health and practices*
- *Design core engineering systems to scale inference, evaluation, and fine-tuning*

## The Challenge

You will be developing an end-to-end product experience for a fine-dining restaurant, *French Laudure*. You will be graded on:

- *The product UX and completeness*
- *Your use of LLMs and agentism*
- *Code and systems quality + maintanability*

You will have an opportunity to walk us through your code, the product, and various design decisions you might’ve made. 

---

A critical part of every fine dining restaurant’s day is their **morning huddle**—a short, focused meeting in which the head chef, maître d’, and staff review the day’s bookings, special events, and guest preferences. Traditionally, this involves scanning through a reservation management system or guest database to identify which tables need special attention, whether there are specific dietary restrictions (e.g., allergies), VIP guests, or upcoming menu items that require extra coordination.

The morning huddle might be led by the restaurant’s general manager or head chef, bringing together both front-of-house and back-of-house teams to ensure a seamless dining experience. During this huddle, staff align on the day’s service flow, highlight any special requests, and clarify roles and responsibilities to deliver an exceptional experience for every guest.

## The Task

You will be building a “morning huddle” tool that:

1. **Automates gathering and presenting** relevant reservations and guest insights (e.g., dietary restrictions, special occasions, VIP status).
    1. Shows the day’s reservations and guest insights
    2. *It’s up to you* to decide what information to show party-by-party
2. **Aligns the staff on the day’s priorities**
    1. Our two main stakeholders are the **front-of-house** and **back-of-house** staff. You will build for one of them.
    2. The back-of-house needs to know what to expect in terms of ordering volume and menu types. They want orders going out quickly and with high-quality.
    3. The front-of-house wants to maximize guest satisfaction and personalization. It’s up to you to decide what the FoH needs to know.

<aside>
💡

Again, we are only expecting that you complete this for **one** of the stakeholders (the front-of-house or back-of-house). Feel free to do both if time allows.

</aside>

You can find a dataset for the task at this [Github](https://github.com/dannybess1/s-t-challenge/tree/main/data/product-engineering). In there, you will find a set of ~50 diners that are coming in to the restaurant the next day. You can assume that this is a full list of diners for the restaurant’s daily activities. 

---

You are free to build this with whatever stack you’d like. At ShowAndTell, we use Typescript, React, and Remix for our frontend, Python and FastAPI for our backend, and host our infra w/ k8s.

The product can take many shapes. We have seen full-stack websites, iPad apps, and voice-only experiences. 

## Instructions and Guidelines

1. The challenge should take **no more than 3 hours** to complete. 
2. You can ignore authentication, user controls, or complex role-based access (RBAC). Focus on functionality and clarity of presentation.
3. Feel free to augment the dataset provided to you if you feel as if it doesn’t adequately represent your product’s capabilities.

---

*When developing, please:*

1. Save the larger prompts you use (i.e. ChatGPT/Claude playground prompts, Cursor Composer prompts, etc). It’s alright to leave out small edits - we just want to see your workflow.
2. Commit frequently and describe the work you’ve done.

---

*To submit, please:*

1. Share the repo with *dannybess1* and *justzhou13* on Github. We will reach back out to schedule 30-45 min to walk through your codebase, system design, and the product!
import json
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any
from analyze import Processor, DinersList

app = FastAPI(title="Restaurant Insights API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_FILE = "output.json"

@app.get("/")
async def root():
    return {"message": "Restaurant Insights API", "status": "running"}

@app.get("/api/profiles")
async def get_profiles() -> Dict[str, Any]:
    try:
        if not os.path.exists(OUTPUT_FILE):
            raise HTTPException(
                status_code=404, 
                detail="Insights data not found. Please generate insights first."
            )
        
        with open(OUTPUT_FILE, 'r') as f:
            data = json.load(f)
        
        return data
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=404, 
            detail="Insights file not found"
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, 
            detail="Error reading insights data"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
!pip install --upgrade pip
!pip install --upgrade transformers scipy

import random
from transformers import pipeline
import scipy
import argparse

def read_prompts(file_path, category):
    prompts = []
    with open(file_path, "r") as f:
        data = f.readlines()
    for i in data:
        line = i.strip()
        if line:
            category_name, prompt = line.split(": ", 1)
            if category_name == category:
                prompts.append(prompt)
    return prompts


def main():
    parser = argparse.ArgumentParser(description='Generate music based on a prompt.')
    parser.add_argument('prompt', type=str, help='The emotion prompt for the music generation.')
    
    args = parser.parse_args()
    
    fear_prompts = read_prompts("prompts.txt", args.prompt)
    prompt = random.choice(fear_prompts)
    print(prompt)
    
    synthesiser = pipeline("text-to-audio", "facebook/musicgen-small", device="cuda")
    music = synthesiser(prompt, forward_params={"do_sample": True})
    scipy.io.wavfile.write("musicgen_out.wav", rate=music["sampling_rate"], data=music["audio"])

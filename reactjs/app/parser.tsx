"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export function Parser() {
    const [selectedFile,setSelectedFile] = useState();
    const [summary,setSummary] = useState();
    const [loading,setLoading] = useState(false);
    const onFileChange = (event) => {
        setLoading(true);
        
        setSelectedFile(event.target.files[0])
        const file = event.target.files[0];
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
    
        axios.post("https://tensorgirl-gemini-resume-parser.hf.space/resume_parser/", formData)
        .then((response) => {
          // File upload successful
          console.log(response.data);
          setLoading(false);

          setSummary(response.data);
        })
        .catch((error) => {
          // File upload failed
          setLoading(false);
          console.log(error);
        //   this.response = error;
      });
      };

      if(loading){

        return <div className="flex flex-col justify-center items-center gap-4 px-10 h-screen w-screen animate-spin text-2xl" >|-|</div>
      }
    
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-10 h-screen w-screen" >
        <h1>Resume Parser</h1>
        <h3>Checkout Key Highlights of your resume</h3>
        <div>
          <input
            type="file"
            onChange={onFileChange}
          />
        </div>
        <span className="loader"><span className="loader-box"></span><span className="loader-box"></span><span className="loader-box"></span></span>
        <h3>Summary</h3>
        <p>
          {summary}
        </p>
      </div>
  )
}
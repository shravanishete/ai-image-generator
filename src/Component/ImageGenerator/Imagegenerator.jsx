
import React, { useRef, useState } from 'react';
import './Imagegenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setimage_url] = useState("/"); // image_url(variablename) setimage(functionname)
  let inputRef = useRef(null); // Used to create a reference to a DOM element, allowing direct manipulation.
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return 0;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.bannerbear.com/v2/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer bb_pr_7cf0d92609f38e8ee2468b1cdb1f53", 
            "User-Agent":"Chrome",
          },
          body: JSON.stringify({
            prompt:'${inputRef.current.value}',
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch image generation. Status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);
      let data_array = data.data;

      if (data_array && data_array.length > 0) {
        setimage_url(data_array[0].url);
      } else {
        console.error("No image URL found in the response data.");
      }
    } catch (error) {
      console.error("Error occurred during image generation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">AI Image <span>Generator</span></div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? default_image : image_url} alt='img'/>
        </div>
      </div>
      <div className="loading">
        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
        <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
      </div>
      <div className="search-box">
        <input type='text' ref={inputRef} className='search-input' placeholder='Describe the image that you want to create'/>
        <div className="generate-btn" onClick={imageGenerator}>Generate</div>
      </div>
    </div>
  );
}

export default ImageGenerator;

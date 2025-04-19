'use client';

import { useState } from 'react';
import formSchema from '@/lib/schema';

export default function Home() {
  const [formData, setFormData] = useState({ url: '', alias: '', duration: '', server: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [copy, setCopy] = useState(false);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(success);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        url: fieldErrors.url?.[0],
        alias: fieldErrors.alias?.[0],
        duration: fieldErrors.duration?.[0],
      });
    } else {
      try {
        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess(data.shortUrl);
        } else {
          setErrors({ server: 'Internal Server Error' });
        }
      } catch (error) {
        setErrors({ server: 'Internal Server Error' });
      }
    }

    console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <div className="flex flex-grow flex-col justify-center items-center">
        <div className="w-full max-w-sm md:max-w-xl px-2">
          <h1 className="font-bold text-3xl md:text-5xl text-center text-[#00ff00] mb-3 md:mb-7">HytamShortener</h1>
          {success ? (
            <div className="text-[#00ff00] p-4 border border-[#00ff00] rounded-lg">
              <label className={`block text-[#00ff00] text-lg font-bold ${copy ? '' : 'mb-3'}`}>Shortened URL:</label>
              {copy && <p className="text-[#00ff00] text-center">Copied!</p>}
              <div className="flex gap-2">
                <input name="shortened" className="border rounded-lg w-full py-2 px-3 focus:outline-none text-gray-700" value={success} readOnly />
                <button
                  className="bg-[#00e600] hover:bg-[#00b300] hover:text-[#0d0d0d] text-[#252525] font-bold py-2 px-4 rounded focus:outline-none"
                  type="button"
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <form id="box" onSubmit={handleSubmit} className="w-full rounded shadow">
              <div className="mb-4">
                <input
                  name="url"
                  type="text"
                  value={formData.url}
                  onChange={handleOnChange}
                  placeholder="Enter URL to shorten"
                  className="border rounded-lg w-full py-2 px-3 focus:outline-none text-gray-700"
                  required
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-4 bg-[#00e600] hover:bg-[#00b300] hover:text-[#0d0d0d] text-[#252525] font-bold py-2 px-4 rounded focus:outline-none"
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
              {showAdvanced && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="mb-4">
                      <label htmlFor="alias" className="block text-[#00ff00] text-base font-bold mb-2">
                        Custom Alias
                      </label>
                      <input
                        name="alias"
                        type="text"
                        value={formData.alias}
                        onChange={handleOnChange}
                        placeholder="Enter custom alias (optional)"
                        className="border rounded-lg w-full py-2 px-3 focus:outline-none text-gray-700"
                      />
                      {errors.alias && <p className="text-red-500 text-sm">{errors.alias}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiration" className="block text-[#00ff00] text-base font-bold mb-2">
                        Expiration Date
                      </label>
                      <select
                        name="duration"
                        className="border rounded-lg w-full py-2 px-3 focus:outline-none text-gray-700"
                        onChange={handleOnChange}
                        defaultValue={formData.duration}
                      >
                        <option value="" disabled>
                          Select expiration date
                        </option>
                        <option value="3h">3 Hours</option>
                        <option value="12h">12 Hours</option>
                        <option value="1d">1 Day</option>
                        <option value="7d">1 Week</option>
                      </select>
                      {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                    </div>
                  </div>
                </>
              )}
              <button
                type="submit"
                className={`${showAdvanced ? '' : 'ms-2 '}bg-[#00e600] hover:bg-[#00b300] hover:text-[#0d0d0d] text-[#252525] font-bold py-2 px-4 rounded focus:outline-none`}
              >
                Shorten URL
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useSearchContext } from '~context/SearchContext';

const ContactUs = () => {
  const [selectedOption, setSelectedOption] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const { user, userEmail } = useSearchContext();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // You can implement the logic to send the message here
    // For example, you can use an email library or API to send the message
    const emailContent = `User: ${user ? userEmail : 'Anonymous'}
Type of Question: ${selectedOption}
Message: ${message}`;

    // Send the email content to your desired email address
    sendEmail('priceseekr8@gmail.com', 'Contact Us Message', emailContent);

    // Reset the form
    setSelectedOption('General Inquiry');
    setMessage('');
  };

  const sendEmail = (to, subject, body) => {
    // Implement your email sending logic here
    // You can use a third-party library or API to send the email
    // This is a simplified example and should be replaced with your implementation
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  };

  return (
    <div className="mt-5 px-2 py-5 max-w-[340px] mx-auto">
      <div className="text-center font-semibold text-xl mb-4">Contact Us</div>

      <div className="mb-4">
        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
          Type of Question
        </label>
        <select
          id="questionType"
          name="questionType"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Feedback">Feedback</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={message}
          onChange={handleMessageChange}
        ></textarea>
      </div>

      <div className="text-center">
        <button
          className="px-6 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ContactUs;

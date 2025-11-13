import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "../styles/faq.css";

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Click on “Book a Free Consultation” and select a time slot.",
  },
  {
    question: "Can I chat on WhatsApp?",
    answer: "Yes! Click on the WhatsApp button to start chatting with us.",
  },
  {
    question: "Is the service free?",
    answer: "We offer a free consultation; further services may have fees.",
  },
  {
    question: "How long does a consultation take?",
    answer: "A typical consultation takes around 30 minutes.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" data-aos="fade-up" data-aos-delay="800">
      <h2 className="faq-title">Frequently Asked Questions ❓</h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{item.question}</h3>
              {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeIndex === index ? "200px" : "0",
              }}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

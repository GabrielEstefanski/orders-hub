import { useState } from "react";

interface AccordionItemProps {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  isFirst: boolean;
}

const AccordionItem = ({
  id,
  title,
  content,
  isOpen,
  onToggle,
  isFirst,
}: AccordionItemProps) => {
  return (
    <div>
      <h2 id={`accordion-collapse-heading-${id}`}>
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200
            ${isFirst ? "rounded-t-xl" : ""} 
            focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3`}
          onClick={() => onToggle(id)}
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls={`accordion-collapse-body-${id}`}
        >
          <span>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${id}`}
        className={`transition-all duration-300 ${isOpen ? "block" : "hidden"} border-b-0`}
        aria-labelledby={`accordion-collapse-heading-${id}`}
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
          <p className="mb-2 text-gray-500 dark:text-gray-400">{content}</p>
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: { id: string; title: string; content: string }[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {items.map((item, index) => {
        const isFirst = index === 0;

        return (
          <AccordionItem
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            isOpen={openItemId === item.id}
            onToggle={handleToggle}
            isFirst={isFirst}
          />
        );
      })}
    </div>
  );
};

export default Accordion;

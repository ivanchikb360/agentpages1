import React from 'react';
import { motion } from 'framer-motion';

interface PageElement {
  type: string;
  content: any;
  style: any;
  animation?: {
    initial: any;
    animate: any;
    transition: any;
  };
  interaction?: {
    hover?: any;
    tap?: any;
    whileInView?: any;
  };
}

interface PageSection {
  id: string;
  type: string;
  content: {
    elements: PageElement[];
    layout?: string;
    background?: {
      type: string;
      value: any;
    };
  };
  style: any;
}

interface PageStructure {
  layout: {
    sections: PageSection[];
    globalStyles: {
      theme: any;
      animations: any;
      breakpoints: any;
    };
  };
}

interface PageRendererProps {
  structure: PageStructure;
}

const renderElement = (element: PageElement, index: number) => {
  const { type, content, style, animation, interaction } = element;

  const motionProps = {
    ...animation,
    ...interaction,
    style: {
      ...style,
      position: style.position || 'relative',
    },
  };

  switch (type) {
    case 'hero':
      return (
        <motion.div key={index} className="relative w-full" {...motionProps}>
          {content.background && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  content.background.type === 'gradient'
                    ? content.background.value
                    : content.background.type === 'image'
                    ? `url(${content.background.value})`
                    : content.background.value,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div className="relative z-10 container mx-auto px-4">
            {content.elements?.map((el, i) => renderElement(el, i))}
          </div>
        </motion.div>
      );

    case 'heading':
      return (
        <motion.h1 key={index} className="font-bold" {...motionProps}>
          {content.text}
        </motion.h1>
      );

    case 'text':
      return (
        <motion.p key={index} {...motionProps}>
          {content.text}
        </motion.p>
      );

    case 'image':
      return (
        <motion.img
          key={index}
          src={content.src}
          alt={content.alt || ''}
          className="max-w-full h-auto"
          {...motionProps}
        />
      );

    case 'button':
      return (
        <motion.button
          key={index}
          className="px-6 py-2 rounded-lg"
          {...motionProps}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content.text}
        </motion.button>
      );

    case 'container':
      return (
        <motion.div key={index} className="relative" {...motionProps}>
          {content.elements?.map((el, i) => renderElement(el, i))}
        </motion.div>
      );

    case 'feature':
      return (
        <motion.div
          key={index}
          className="relative p-6 rounded-xl"
          {...motionProps}
        >
          {content.icon && <div className="mb-4">{content.icon}</div>}
          <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
          <p>{content.description}</p>
        </motion.div>
      );

    default:
      return null;
  }
};

const PageRenderer: React.FC<PageRendererProps> = ({ structure }) => {
  if (!structure?.layout?.sections) {
    return <div>No content to display</div>;
  }

  return (
    <div className="min-h-screen">
      {structure.layout.sections.map((section, index) => (
        <section
          key={section.id || index}
          className="relative"
          style={section.style}
        >
          {section.content.background && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  section.content.background.type === 'gradient'
                    ? section.content.background.value
                    : section.content.background.type === 'image'
                    ? `url(${section.content.background.value})`
                    : section.content.background.value,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div
            className={`relative z-10 ${
              section.content.layout === 'full' ? '' : 'container mx-auto px-4'
            }`}
          >
            {section.content.elements?.map((element, i) =>
              renderElement(element, i)
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PageRenderer;

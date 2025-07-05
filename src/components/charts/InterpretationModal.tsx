/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ThreadingLines from "../threading/ThreadingLines";

interface InterpretationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  text: string;
  icon: string;
  iconColor: string;
}

interface ParsedSection {
  type: "header" | "paragraph";
  content: string;
}

const parseInterpretationText = (text: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Check if line is a section header - be more specific
    const isHeaderPattern =
      line.startsWith("PLANETARY STRENGTH") ||
      line.startsWith("LIFE AREA EXPRESSION") ||
      line.startsWith("SIGN EXPRESSION");

    if (isHeaderPattern) {
      sections.push({
        type: "header",
        content: line,
      });
    } else {
      // Regular paragraph content
      sections.push({
        type: "paragraph",
        content: line,
      });
    }
  }

  return sections.length > 0
    ? sections
    : [{ type: "paragraph", content: text }];
};

const InterpretationModal: React.FC<InterpretationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  text,
  icon,
  iconColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-black max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-white border-b border-black p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-xl">
                <span className="text-white">{icon}</span>
              </div>
              <div>
                <h2 className="font-space-grotesk text-2xl font-bold text-black">{title}</h2>
                <p className="font-open-sans text-black/60">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group relative w-10 h-10 bg-black/10 hover:bg-black border border-black transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <FontAwesomeIcon icon={faTimes} className="relative text-black group-hover:text-white transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
          <div className="space-y-8">
            {parseInterpretationText(text).map((section, index) => {
              if (section.type === "header") {
                const formatHeaderContent = (content: string) => {
                  // Extract parentheses content if present
                  const match = content.match(/^(.+?)\s*\((.+)\)$/);
                  if (match) {
                    const mainText = match[1].replace(/([A-Z]+\s[A-Z]+)/g, (m) =>
                      m.split(" ").map(word => 
                        word.charAt(0) + word.slice(1).toLowerCase()
                      ).join(" ")
                    );
                    const parenthesesText = match[2];
                    return { mainText, parenthesesText };
                  }
                  
                  // No parentheses, just format the text
                  const mainText = content.replace(/([A-Z]+\s[A-Z]+)/g, (m) =>
                    m.split(" ").map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(" ")
                  );
                  return { mainText, parenthesesText: null };
                };

                const { mainText, parenthesesText } = formatHeaderContent(section.content);

                return (
                  <div key={index} className="mt-12 mb-6 first:mt-0">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-black">
                      <h3 className="font-space-grotesk text-xl font-bold text-black">
                        {mainText}
                      </h3>
                      {parenthesesText && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-black/10 text-black border border-black">
                          {parenthesesText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="mb-6">
                    <p className="font-open-sans text-black leading-relaxed text-base">
                      {section.content}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
          border: 1px solid #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #000;
          border: 1px solid #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default InterpretationModal;

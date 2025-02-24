import { Sections, Section, Repeated } from "./types";

export class SectionExpender {
    public expandRepeated(ast: Sections | Section): Sections {
        let sections: Sections = { type: "Sections", sections: [] };

        const expand = (section: Section) => {
            for (let i = 0; i < ((section.nodes as Repeated)?.times ?? 0); i++) {
              if ((section.nodes as Repeated).toRepeat.type === "Section") {
                sections.sections.push((section.nodes as Repeated).toRepeat as Section);
              } else if ((section.nodes as Repeated).toRepeat.type === "Sections") {
                for (const subSection of ((section.nodes as Repeated).toRepeat as Sections).sections) {
                  sections.sections.push(subSection);
                }
              }
            }
        };

        if (ast.type === "Sections") {
            for (const section of ast.sections) {
              if (section.nodes.type === "Repeated" && (section.nodes as Repeated).times) {
                expand(section);
              } else {
                sections.sections.push(section);
              }
            }
          } else if (ast.type === "Section") {
            if (ast.nodes.type === "Repeated" && (ast.nodes as Repeated).times) {
              expand(ast);
            } else {
              sections.sections.push(ast);
            }
          }
      
          return sections;
    }
}
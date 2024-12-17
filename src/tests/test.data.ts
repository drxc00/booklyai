/*

Here we have predefined data for experimenting and testing the API

*/

// helper function for simulating delay when calling the API
export const delay = async (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const testBookOutline = async (): Promise<BookOutline> => {
    // Simulate the API call
    await delay(5000); // Simulate delay
    return {
        booktitle: "Lorem Ipsum: A Comprehensive Exploration",
        chapters: [
            {
                title: "Introduction to Lorem Ipsum",
                subchapters: [
                    { title: "Origins and Foundations" },
                    { title: "Historical Development" },
                    { title: "Theoretical Implications" }
                ]
            },
            {
                title: "Conceptual Frameworks",
                subchapters: [
                    { title: "Fundamental Principles" },
                    { title: "Methodological Approaches" },
                    { title: "Analytical Perspectives" }
                ]
            },
            {
                title: "Advanced Interpretations",
                subchapters: [
                    { title: "Complex Systemic Analysis" },
                    { title: "Interdisciplinary Connections" },
                    { title: "Emerging Paradigms" }
                ]
            },
            {
                title: "Practical Applications",
                subchapters: [
                    { title: "Implementation Strategies" },
                    { title: "Operational Mechanisms" },
                    { title: "Future Developments" }
                ]
            },
            {
                title: "Critical Reflections",
                subchapters: [
                    { title: "Theoretical Challenges" },
                    { title: "Societal Implications" },
                    { title: "Prospective Insights" }
                ]
            }
        ]
    }
}

const testBookContent = async (): Promise<BookChapter> => {
    // Simulate the API call
    await delay(3000); // Simulate delay
    return {
        title: "Introduction to Lorem Ipsum",
        introduction: "In the expansive realm of intellectual discourse, a profound exploration emerges that challenges conventional understanding and propels our comprehension into uncharted territories. This comprehensive investigation delves deep into the intricate mechanisms of conceptual frameworks, unraveling complex systems of thought and methodology. As we embark on this intellectual journey, we shall navigate through multifaceted landscapes of knowledge, challenging preconceived notions and illuminating nuanced perspectives that transcend traditional boundaries of understanding.",
        subchapters: [
            {
                title: "Foundational Concepts",
                content: "The exploration of fundamental principles requires a meticulous approach that synthesizes theoretical constructs with empirical observations. Emerging paradigms suggest intricate relationships between seemingly disparate domains, revealing underlying patterns of complexity and interconnectedness. Our analysis traverses multiple dimensions, examining the subtle interplay of conceptual elements that shape our understanding of sophisticated systems.\n\n- **Theoretical Dimensions:** Investigating the multifaceted nature of conceptual frameworks\n- **Methodological Approaches:** Developing innovative strategies for comprehensive analysis\n- **Interdisciplinary Perspectives:** Bridging diverse intellectual territories"
            },
            {
                title: "Historical Development",
                content: "Tracing the evolutionary trajectory of intellectual constructs reveals a fascinating narrative of human knowledge. From early foundational theories to contemporary sophisticated approaches, our journey illuminates the dynamic nature of conceptual understanding. Each historical phase represents a critical juncture in the progressive development of complex theoretical frameworks.\n\n- **Epistemological Foundations:** Examining the roots of conceptual understanding\n- **Transformative Paradigms:** Identifying critical moments of intellectual shift\n- **Evolutionary Trajectories:** Mapping the progression of theoretical constructs"
            },
            {
                title: "Advanced Interpretations",
                content: "As we delve into advanced interpretations, we encounter increasingly sophisticated methodologies that challenge traditional boundaries of knowledge. The intricate landscape of intellectual exploration demands nuanced approaches that transcend simplistic categorizations. Our analysis reveals complex systemic interactions that underscore the profound complexity of human understanding.\n\nBy synthesizing diverse perspectives and employing rigorous analytical frameworks, we uncover deeper layers of insight that reshape our comprehension of intricate conceptual systems. The journey of intellectual discovery continues, perpetually expanding the horizons of human knowledge."
            }
        ],
        conclusion: "Our comprehensive exploration has traversed intricate intellectual territories, revealing the profound complexity inherent in conceptual frameworks. Through meticulous analysis and nuanced interpretation, we have illuminated pathways of understanding that challenge traditional boundaries of knowledge. The journey of intellectual discovery remains an ongoing process, inviting continuous reflection and transformative insights."
    };
}

export const TestData = {
    testBookOutline: testBookOutline,
    testBookContent: testBookContent
}
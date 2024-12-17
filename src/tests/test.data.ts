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
        booktitle: "Exploring the Fermi Paradox: Where Is Everybody?",
        chapters: [
            {
                title: "Introduction to the Fermi Paradox",
                subchapters: [
                    {
                        title: "What Is the Fermi Paradox?"
                    },
                    {
                        title: "Historical Context and the Origin of the Paradox"
                    },
                    {
                        title: "Scientific Implications of the Fermi Paradox"
                    }
                ]
            },
            {
                title: "The Universe: An Ideal Host for Life",
                subchapters: [
                    {
                        title: "Galaxies, Stars, and Planets: The Cosmic Landscape"
                    },
                    {
                        title: "Conditions for Life: From Extremophiles to Earth-like Worlds"
                    },
                    {
                        title: "The Drake Equation: Estimating Extraterrestrial Life"
                    }
                ]
            },
            {
                title: "Possible Resolutions to the Paradox",
                subchapters: [
                    {
                        title: "The Great Filter: Filters in Our Past or Future?"
                    },
                    {
                        title: "Self-Destruction: The Dark Side of Intelligent Life"
                    },
                    {
                        title: "The Zoo Hypothesis: Observed But Not Engaged"
                    }
                ]
            },
            {
                title: "Technological Considerations and Signals from Space",
                subchapters: [
                    {
                        title: "The Search for Extraterrestrial Intelligence (SETI)"
                    },
                    {
                        title: "Message Codes and Communication Across the Cosmos"
                    },
                    {
                        title: "Technological Advancements and the Future of Space Exploration"
                    }
                ]
            },
            {
                title: "Philosophical and Societal Implications",
                subchapters: [
                    {
                        title: "What the Fermi Paradox Teaches Us About Humanity"
                    },
                    {
                        title: "Societal Reactions: The Impact of Discoveries on Human Culture"
                    },
                    {
                        title: "The Future of Human-Extraterrestrial Relationships"
                    }
                ]
            }
        ]
    }
}

const testBookContent = async (): Promise<BookChapter> => {
    // Simulate the API call
    await delay(3000); // Simulate delay
    return {
        title: "Introduction to the Fermi Paradox",
        introduction: "In the vast and unfathomable cosmos, where trillions of stars twinkle across the velvet dark, humanity raises a poignant query that haunts the minds of skeptics and dreamers alike: If the universe is teeming with countless celestial bodies, each potentially harboring life, where is everyone? This question crystallizes in the form of the Fermi Paradox, a conundrum named after the illustrious physicist Enrico Fermi, that juxtaposes the staggering probability of extraterrestrial life against the conspicuous silence of the cosmos. The divergent perceptions of existence beyond Earth beckon us to traverse through historical narratives, contemporary research, and futuristic speculations. This chapter endeavors to unravel the intricate tapestry of the Fermi Paradox, dissecting its origins, its implications in modern astronomy, and the cognitive dissonance it fosters within the human understanding of life in the universe. \n\nAs we journey through this exploration, we will not only illuminate the scientific intricacies but also delve into the philosophical inquiries it provokes, instigating contemplations that bridge disciplines from astrophysics to existential philosophy. This inquiry does not merely reside within the realm of scientific discourse but reverberates through our cultural, societal, and psychological landscapes, prompting us to ponder our place in the universe. In the unfolding sections, we shall first define what the Fermi Paradox entails, then examine its historical roots, concluding with its significance in the current astronomical climate and its overarching implications on humanity's quest for belonging among the stars.",
        subchapters: [
            {
                title: "What is the Fermi Paradox?",
                content: "The Fermi Paradox elegantly encapsulates a question that bewildered scientists and intellectuals alike: considering the vast number of stars in the universe, many of which have planets that could potentially support life, why have we not yet detected any signs of extraterrestrial civilizations? The paradox is named after Enrico Fermi, a physicist who famously articulated this question during a meeting with colleagues in the early 1950s. During this discussion, Fermi noted the remarkable number of stars in our galaxy—approximately 100 billion—and posited that if even a small fraction of those stars had planets suitable for life, then the galaxy should be teeming with intelligent beings. Yet, without any evidence of such life forms, a dissonance emerges — a paradox of silence amid the cosmos’ vastness.\n\nTo dissect the Fermi Paradox, we must first consider the Drake Equation, formulated by astronomer Frank Drake in 1961 that quantifies the potential number of civilizations in our galaxy. The equation factors in elements including the rate of star formation, the fraction of stars with planetary systems, the number of planets that could potentially support life, and other variables ultimately leading to the emergence of intelligent life. This equation serves both as a tool for scientific inquiry and a manifestation of our hopes for extraterrestrial contact.\n\nYet, the paradox extends further than mere calculations. It transcends into the philosophical realm, contemplating not just the existence of life beyond Earth but the very nature of intelligence itself. \n\n- **Intelligent Design and Evolution:** The evolution of intelligence involves various theories, each offering unique interpretations on why intelligent life—if it exists—might not be communicative or detectable. Maybe intelligent civilizations are too rare, or their technological solutions do not align with our own definitions of communication.\n- **Cosmic Isolation:** Perhaps these civilizations are self-destructive, technologically advanced yet unsustainable, mindful of the ephemeral nature of existence that leads them to annihilate themselves before achieving interstellar communication.\n- **Temporal Considerations:** Another compelling aspect to ponder is that civilizations may rise and fall within limited timescales, leaving vast windows of silence globally across cosmic timelines. The geological age of Earth provides us a unique perspective on the universe's eons and the brief moments intelligences might inhabit them. \n\nTo understand the Fermi Paradox, we must traverse through models of existence, looking beyond the mathematical frameworks into psychological implications — asking profound questions about ourselves and the universe. As we continue this exploration, we will unpack the historical significance and undercurrents of Fermi's original queries, the implications of which reconfigure our notions of existence in an incomprehensibly large and complex universe."
            },
            {
                title: "Historical Context and Origins",
                content: "The Fermi Paradox is not merely a modern scientific inquiry but is deeply rooted in the historical context that stretches back to ancient civilizations. The fascination with celestial bodies and the possibility of life beyond our terrestrial confines can be traced back to the dawn of human consciousness. Ancient philosophers, such as Aristotle and Plato, grappled with ideas that hinted at life beyond Earth, contemplating the nature of the cosmos and humanity’s place within it.\n\nThe modern scientific inquiries began to coalesce around the late 19th century, driven largely by advancements in astronomy and emerging theories in evolution. The discovery of numerous exoplanets transcended the mythos of a geocentric universe, reinforcing the statistical likelihood of life beyond our solar system. Moreover, the advent of Darwinian evolution instigated profound reflections on the randomness of existence and the survival of species—concepts parallel to the survival and discovery of potential extraterrestrial civilizations. As the 20th century enveloped humanity in the renaissance of space exploration, the excitement heightened with speculative fiction and popular science proliferating public interest in the cosmos.\n\n- **The Role of Seti:** In 1960, the Search for Extraterrestrial Intelligence (SETI) initiated systematic efforts to detect intelligent signals from other worlds. Frank Drake, an instrumental figure, engaged these inquiries through the establishment of the Drake Equation, which sought to scientifically approach questions about the Fermi Paradox. While earlier civilizations pondered worldviews through a philosophical lens, the mid-20th century introduced technological capacity, enhancing how we explore, receive, and interpret cosmic signals.\n- **The Cold War:** The zeitgeist of the era also played a significant role in framing scientific inquiries. The Cold War, with its race to technological supremacy, expanded human imagination and the sense of curiosity regarding other intelligent life forms. The contrast between hope for communication with alien life and the existential dread inspired by political tensions shaped the discourse surrounding the Fermi Paradox.\n\nMoreover, the emergence of various theories attempting to elucidate the Fermi Paradox reflects the diverse interpretations threaded through society. \n- **The Great Filter Theory:** One predominant hypothesis insinuates the existence of a \"Great Filter\"—a stage in evolutionary development that is extraordinarily hard for life to surpass, which could manifest as a universal catastrophe or an intrinsic quality regarding the evolution of intelligence itself.\n- **Temporal Isolation:** Another hypothesis posits that civilizations could exist temporarily and sporadically, leading to periods of cosmic silence. This presents a startling reality: perhaps civilizations both arise and extinguish swiftly over cosmic timescales, making communication an elusive, rare phenomenon.\n\nOn this historical foundation, we see how cultural narratives have woven themselves into the scientific narrative of the Fermi Paradox. As human knowledge evolves, so too must our inquiries into existence. This examination arms us with nuanced perspectives that allow for an intersection of science, philosophy, and culture as we examine the haunting silence of the cosmos. As we transition to the next section, we will look closely at the significance of the Fermi Paradox within contemporary astronomy, piecing together its relevance amid unfolding research that seeks to grasp the underlying truths of our universe."
            },
            {
                title: "Significance in Modern Astronomy",
                content: "The Fermi Paradox stands as a cornerstone of discussion and exploration within modern astronomy, intertwining the quest for extraterrestrial life with pressing existential questions. The crux of the paradox—its poignant juxtaposition between probability and silence—fuels contemporary research that straddles the boundary of traditional astronomy and interdisciplinary inquiry. As researchers meticulously examine the vastness of the cosmos with advanced technologies, we observe a resurgence in scientific interest that stimulates both public fascination and academic rigor regarding the likelihood of intelligent life beyond Earth.\n\n- **The Expansion of Exoplanet Research:** Since the dawn of the Kepler Space Telescope in 2009, billions of exoplanets have been detected across our galaxy. The newfound understanding that many of these exoplanets exist within the habitable zones of their respective stars has intensified discussions surrounding the conditions suitable for life. Perhaps more extraordinarily, scientists are discovering potential biosignatures on these planets—elements that could indicate the presence of life forms, further complicating the Fermi Paradox. If conditions for life are prevalent throughout the cosmos, why do we remain solitary in our pursuits?\n\n- **Astrobiology and Habitability Studies:** The pivotal field of astrobiology meticulously investigates the various conditions and factors that could foster life. Understanding extremophiles—organisms that thrive in desolate conditions on Earth—leads to broader implications that life could exist in forms beyond our conceptual grasp. Researchers studying subsurface oceans on moons like Europa or Titan evoke images of alien ecosystems, extending our criteria for habitation. Such studies affirm that while life is a possibility, the silence remains disconcerting.\n\n- **Technosignatures and Active Searching:** Modern efforts by institutions like NASA and the SETI Institute have now turned from passive listening to active searching for technosignatures—detectable signals or structures created by intelligent life. Utilizing advanced technologies, scientists endeavor to decode the ancient whispers of the cosmos, probing for patterns that transcend noise thresholds. This indicates a shift from speculation to empirical research fueled by technological advancement, yet the silence persists—an ominous reminder that civilization struggles to resonate amid the overwhelming backdrop of the cosmos.\n\nWhile this ongoing quest continues to unravel new knowledge, the very act of taming the paradox solidifies its value to scientific discourse. As discussions surrounding the Fermi Paradox expand, so too does the interrelationship with humanity’s perception of existence. Are we fundamentally isolated, or is this silence an invitation to examine our own civilization’s trajectory?\n\nDrawing from rich philosophical underpinnings, the Fermi Paradox invites humanity to reflect on its understanding of intelligence, the potential for communications, and the limits of our capabilities. As we confront these questions, we find ourselves at a crossroads framed by the ethical implications of contacting other life forms or the existential risks tied to the exploration of unknown realms.\n\nIn closing, the significance of the Fermi Paradox resonates lauded hopes while evoking questions of existential craving—a desire not only for understanding but also for connection. As this chapter concludes, the exploration of the Fermi Paradox astonishes us with potential futures and intellectual discoveries that will shape our narrative amid the stars—paving the way for a deeper appreciation of our cosmic surroundings and our relentless desire to belong within the vast mosaic of existence."
            }
        ],
        conclusion: "The Fermi Paradox, an eloquent articulation of humanity's existential curiosity, serves as a key to unlocking our understanding of the universe and our role within it. Through this chapter, we have navigated the intricate layers of the paradox, defining its essence, tracing its historical roots, and illuminating its significance within contemporary astronomy. As we peer into the vast unknown, we recognize not only our scientific limitations but also the architectural beauty of inquiry itself—an eternal quest for knowledge and connection. \n\nThe myriad theories spanning from the Great Filter to technosignature searches embody the complex interplay between our understanding of life and the universe's enigmatic nature. Whether viewed as a cosmic silence or a profound invitation to reflect on our own civilization, the Fermi Paradox compels us to engage critically with our aspirations, fears, and hopes in an infinite cosmos. As we continue our exploration through the lens of future astronomical endeavors, we can harbor the resolve that each question leads to new horizons; only through inquiry can we fathom the silence and redefine our narrative among the stars."
    };
}

export const TestData = {
    testBookOutline: testBookOutline,
    testBookContent: testBookContent
}
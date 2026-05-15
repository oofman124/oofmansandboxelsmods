// Check if the energy category exists, otherwise place it in solids
let elementCategory = "solids";
if (categories && categories.energy) {
    elementCategory = "energy";
}

// 1. Define the Plutonium element properties
elements.plutonium = {
    color: ["#2e5c1e", "#3a7526", "#1c3d12"], // Shaded radioactive dark green
    behavior: behaviors.WALL,                  // Sits still like a dense metal block
    category: elementCategory,
    state: "solid",
    density: 19800,                            // Extremely heavy metal
    temp: 40,                                  // Starts slightly warm
    tempHigh: 640,                             // Melts at 640°C
    stateHigh: "molten_plutonium",
    
    // Custom ticking physics behavior
    tick: function(pixel) {
        // Generate minor self-heating and occasionally emit radiation
        pixel.temp += 0.2;
        if (Math.random() < 0.05) {
            createPixel("radiation", pixel.x + Math.floor(Math.random()*3)-1, pixel.y + Math.floor(Math.random()*3)-1);
        }
        // Very slow natural radioactive decay into Lead
        if (Math.random() < 0.00005) {
            changePixel(pixel, "lead");
        }
    },
    
    // Nuclear Fission reactions
    reactions: {
        "neutron": { 
            elem1: "explosion",                // Triggers an immediate explosion
            elem2: "radiation",                // Converts the triggering neutron to radiation
            chance: 0.85,                      // High probability chain reaction
            temp1: 3000                        // Generates extreme flash heat
        }
    }
};

// 2. Define Molten Plutonium for when it melts
elements.molten_plutonium = {
    color: ["#d96e14", "#b34e04", "#8c3b00"], // Glowing orange/brown liquid
    behavior: behaviors.LIQUID,                // Melts and flows down
    category: "states",
    state: "liquid",
    density: 16600,
    tempLow: 639,                              // Freezes back into solid Plutonium
    stateLow: "plutonium",
    
    tick: function(pixel) {
        pixel.temp += 0.5;                     // Liquid forms generate heat even faster
        if (Math.random() < 0.1) {
            createPixel("radiation", pixel.x + Math.floor(Math.random()*3)-1, pixel.y + Math.floor(Math.random()*3)-1);
        }
        if (Math.random() < 0.0001) {
            changePixel(pixel, "molten_lead");
        }
    },
    
    reactions: {
        "neutron": { 
            elem1: "explosion", 
            elem2: "radiation", 
            chance: 0.95,                      // Liquid fission is even more unstable
            temp1: 4000 
        }
    }
};

// 3. Make Uranium reactors create Plutonium over time (Breeder Reactor logic)
if (elements.uranium) {
    if (!elements.uranium.reactions) elements.uranium.reactions = {};
    elements.uranium.reactions.neutron = {
        elem1: "plutonium",                    // Uranium absorbs a neutron to breed Plutonium
        elem2: null,
        chance: 0.02                           // Low chance to balance regular uranium fission
    };
}

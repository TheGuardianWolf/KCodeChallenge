/**
 * In this file I implement the solution to problem 3. This problem seems to be the easiest,
 * requiring just emulation of a rover's movements. This does not require the grid to be setup as
 * the rovers are independant and have no interaction.
 *
 * Assumptions:
 * - The rover is not driven off the grid.
 */

class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
}

enum Heading {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}

enum Instruction {
    LEFT = -1,
    MIDDLE = 0,
    RIGHT = 1
}

const headingLetterMapping = ['N', 'E', 'S', 'W'];

const letterToHeading = (letter: string): Heading => {
    return headingLetterMapping.indexOf(letter);
};

const headingToLetter = (heading: Heading): string => {
    return headingLetterMapping[heading];
};

const instructionLetterMapping = ['L', 'M', 'R'];

const letterToInstruction = (letter: string): Instruction => {
    return instructionLetterMapping.indexOf(letter) - 1;
};

const instructionToLetter = (instruction: Instruction): string => {
    return instructionLetterMapping[instruction];
};

const positionChangeByHeading = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

const moveInHeading = (heading: Heading, position: Coordinate): void => {
    const [addX, addY] = positionChangeByHeading[heading];
    position.add(addX, addY);
};

class Rover {
    position: Coordinate;
    heading: Heading;
    instructions: Instruction[];

    constructor(position: Coordinate, heading: Heading, instructions: Instruction[]) {
        this.position = position;
        this.heading = heading;
        this.instructions = instructions;
    }

    private moveForward(): void {
        moveInHeading(this.heading, this.position);
    }

    private runInstruction(instruction: Instruction) {
        if (instruction === Instruction.MIDDLE) {
            this.moveForward();
        }
        else {
            this.heading = ((<number>this.heading + <number>instruction) + 4) % 4;
        }
    }

    run(): void {
        this.instructions.forEach((instruction) => {
            this.runInstruction(instruction);
        });
    }

    display(): string {
        return `${this.position.x} ${this.position.y} ${headingToLetter(this.heading)}`;
    }
}

class MissionControl {
    static parse(input: string): string {
        const commandList = input.trimRight().split('\n');

        const [gridSizeX, gridSizeY] = commandList[0].split(' ').map(Number.parseInt);
        const gridSize = new Coordinate(gridSizeX, gridSizeY);

        commandList.splice(0, 1);

        const rovers: Rover[] = [];
        for (let i = 0; i < Math.floor(commandList.length / 2); i++) {
            const [initial, instructions] = [
                commandList[i * 2].split(' '),
                commandList[i * 2 + 1].split('').map(letterToInstruction)
            ];
            const initialCoordinates = new Coordinate(
                Number.parseInt(initial[0], 10),
                Number.parseInt(initial[1], 10)
            );
            const initialHeading = letterToHeading(initial[2]);
            rovers.push(new Rover(initialCoordinates, initialHeading, instructions));
        }

        rovers.forEach((rover) => {
            rover.run();
        })

        return rovers.map((rover) => {
            return rover.display();
        }).join('\n');
    }
}

export {
    MissionControl
};

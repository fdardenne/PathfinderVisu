class Problem {
    constructor(positions, walls, max_width, max_height){
        this.positions = positions;
        this.walls = walls;
        this.goals = positions.goal;
        this.max_width = max_width;
        this.max_height = max_height;

        this.available = {
            "up": [0, -1],
            "down": [0, +1],
            "right": [+1, 0],
            "left": [-1, 0]
        }
    }

    initial_state(){
        return new State(self.positions);
    }

    actions(state){
        let action_list = [];
        let agent_x, agent_y;
        [agent_x, agent_y] = state.positions.start;
        for(const [act, [x,y]] of Object.entries(this.available)){
            // Not out of bound
            // console.log("====")
            // console.log(agent_x+x)
            // console.log(this.max_width)
            // console.log(agent_y + y)
            // console.log(this.max_height)
            // console.log("=====")

            if(agent_x+x < this.max_width && agent_x+x >= 0 && agent_y+y < this.max_height && agent_y+y >= 0){
                // No obstacle
                if(!(agent_x+x in self.walls && agent_y+y in self.walls[agent_x+x] && self.walls[agent_x+x][agent_y+y])){
                    action_list.push(act);
                }
            }
        }
        return action_list;
    }

    result(action, state){
        let new_pos = {...state.positions}
        // Update the position of the agent with the action
        new_pos.start = new_pos.start.map((a, i) => a + this.available[action][i]);
        let new_state = new State(new_pos);
        return new_state;
    }

    is_goal(state) {
        let a = state.positions.start;
        let b = this.goals;
        return a.every((v, i) => v === b[i]);
    }
}


class Node {
    constructor(state, cost, parent, action){
        this.state = state
        this.cost = cost
        this.parent = parent
        this.action = action
    }
}

class State {
    constructor(positions){
        this.positions = positions;
    }
}

function expand(problem, node){
    actions = problem.actions(node.state);
    states = []
    actions.forEach(action => {
        let res = problem.result(action, node.state);
        let new_node = new Node(res, node.cost+1, node, action);
        states.push(new_node);
    })
    return states;
}

function bfs(problem){
    let node = new Node(problem.initial_state(), 0, null, "init");
    let fifo = [node];
    let reached = {};
    reached[node.state.positions.start] = true;

    while(fifo.length > 0){
        node = fifo.shift();
        waitingDrawQueue.push([node.state.positions.start[0], node.state.positions.start[1],"#129490"])
        if(problem.is_goal(node.state)) return node;
        let expandd = expand(problem, node);

        expandd.forEach(node => {
            if(!(node.state.positions.start in reached)){
                fifo.push(node);
                waitingDrawQueue.push([node.state.positions.start[0], node.state.positions.start[1], "#FFFFFF"])
                reached[node.state.positions.start] = true;
            }
        });
    }
    return "fail";
}



function dfs(problem){
    let node = new Node(problem.initial_state(), 0, null, "init");
    let fifo = [node];
    let reached = {};
    reached[node.state.positions.start] = true;

    while(fifo.length > 0){
        node = fifo.pop();
        waitingDrawQueue.push([node.state.positions.start[0], node.state.positions.start[1],"#129490"])
        if(problem.is_goal(node.state)) return node;
        let expandd = expand(problem, node);

        expandd.forEach(node => {
            if(!(node.state.positions.start in reached)){
                fifo.push(node);
                waitingDrawQueue.push([node.state.positions.start[0], node.state.positions.start[1], "#FFFFFF"])
                reached[node.state.positions.start] = true;
            }
        });
    }
    return "fail";
}
// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 50, right: 100, bottom: 50, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 275;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 415;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 415;

let filename = "/data/video_games.csv";
// app.js
import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
// Create instances of Model and View
const model = new Model();
const view = new View();
// Inject the instances into Controller
const controller = new Controller(model, view);
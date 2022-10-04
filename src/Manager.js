import { config } from "./config";
import {
  getDoneProjectFromStorage,
  getProjectsFromStorage,
} from "./localStorage";
import { createProject, addTask } from "./Project";
import { createTask } from "./Task";
import { display, main, update } from "./UI";

let projects = [];
let homeProject;
let done;

function getDoneList() {
  return done;
}

function toggleTaskCompletion(task) {
  if (task.completed) {
    done.remove(getTaskIndex(task, done));
    task.completed = false;

    let project = getProjectById(task.project);

    project.add(task);

    updateTasks();
    update();

    return;
  }

  task.completed = true;
  done.add(task);
  removeTask(task.id);
  updateTasks();
  update();
}

function init() {
  initDefaultProjects();
  updateTasks();
  main();
  display(homeProject);
}

function initDefaultProjects() {
  createDoneTasksProject();
  defaultProject();
  projects = getProjectsFromStorage(projects);
  done = getDoneProjectFromStorage(done);
}

function createDoneTasksProject() {
  done = createProject("Done");
  done.id = config.done.id;
}

function getHomeProject() {
  return homeProject;
}

function defaultProject() {
  homeProject = newProject("Home");
  homeProject.id = -1;
}

function updateTasks() {
  homeProject.tasks = homeProject.tasks.filter(
    (task) => getProjectById(task.project).title === homeProject.title
  );
  homeProject.tasks = homeProject.tasks.concat(getAllTasks());
}

function addNewTask(projectId, title, description, dueDate, priority) {
  console.log(getProjectById(projectId));

  addTask(
    getProjectById(projectId),
    createTask(title, description, dueDate, priority)
  );

  updateTasks();
  update();
}

function moveTask(task, newProjectId) {
  const oldProject = getProjectById(task.project);
  const newProject = getProjectById(newProjectId);
  removeTask(task.id);
  addTask(newProject, task);

}

function removeTask(id) {
  let task = getTaskById(id);
  let project = getProjectById(task.project);
  let index = getTaskIndex(task, project);
  console.log(task);
  console.log(index);
  console.log(project);

  project.remove(index);
  updateTasks();
  update();
}

function getTaskById(id, project) {
  id = Number(id);
  if (project) {
    return project.tasks.find((task) => task.id == id);
  }

  let found;
  projects.forEach((project) => {
    project.tasks.forEach((task) => {
      if (task.id === id) {
        found = task;
      }
    });

    //found = project.tasks.find(task => task.id === id);
  });
  if (!found) {
    found = done.tasks.find((task) => task.id == id);
  }

  return found;
}

function locateProject(projectIndex) {
  let project = projects[projectIndex];

  return project;
}

function getTaskIndex(task, project) {
  //const project = getProjectById(task.project);

  const index = project.tasks.findIndex((item) => item.id == task.id);

  if (index > -1) {
    return index;
  } else {
    throw new Error("TASK IS NOT FOUND IN THE PROJECT, TASK INDEX IS -1");
  }
}

function getProjectById(id) {
  id = Number(id);

  if (id === -1) return getHomeProject();
  if (id === config.done.id) return getDoneList();

  const project = projects.find((project) => project.id == id);
  return project;
}

function getAllTasks() {
  let array = [];
  projects
    .filter((project) => project.title !== homeProject.title)
    .forEach((project) => {
      array = array.concat(project.tasks);
    });
  return array;
}

function getProjectIndex(project) {
  let index = projects.indexOf(project);
  return index;
}

function getProjectsAndTitles() {
  let titles = [];
  projects
    .filter((project) => project.title !== homeProject.title)
    .forEach((project) => {
      const obj = {};
      obj[project.title] = project.id;
      titles.push(obj);
    });
  return titles;
}

function newProject(title) {
  let project = createProject(title);
  projects.push(project);

  return project;
}

function iterate(fun) {
  projects.forEach(fun);
}

export {
  projects,
  done,
  newProject,
  iterate,
  init,
  getProjectsAndTitles as getProjectsTitles,
  removeTask,
  getProjectIndex,
  getTaskById,
  addNewTask,
  getHomeProject,
  getProjectById,
  getDoneList,
  toggleTaskCompletion,
  moveTask
};

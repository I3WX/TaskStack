export class Tasks {
  constructor(
    taskName = "New Task",
    description = "No description",
    priority = 1,
    deadline = "No deadline"
  ) {
    this.taskName = taskName;
    this.description = description;
    this.priority = priority;
    this.deadline = deadline;
  }

  // Method to edit the task name
editProperties(properties) {
    this.taskName = properties.taskName;
    this.description = properties.description;
    this.priority = properties.priority;
    this.deadline = properties.deadline
  }

  // Method to return task data
  returnData() {
    const data = {
      taskName: this.taskName,
      description: this.description,
      priority: this.priority,
      deadline: this.deadline,
    };
    return data;
  }
}

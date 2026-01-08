class TaskManager:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task, priority="Normal"):
        self.tasks.append({"task": task, "completed": False, "priority": priority})
        print(f"✓ Task added: {task} [Priority: {priority}]")
    
    def view_tasks(self):
        if not self.tasks:
            print("No tasks available!")
            return
        print("\n--- Your Tasks ---")
        for i, task in enumerate(self.tasks, 1):
            status = "✓" if task["completed"] else "✗"
            priority = task.get("priority", "Normal")
            print(f"{i}. [{status}] {task['task']} - Priority: {priority}")
    
    def complete_task(self, task_number):
        if 0 < task_number <= len(self.tasks):
            self.tasks[task_number - 1]["completed"] = True
            print(f"✓ Task {task_number} marked as completed!")
        else:
            print("Invalid task number!")
    
    def delete_task(self, task_number):
        if 0 < task_number <= len(self.tasks):
            removed = self.tasks.pop(task_number - 1)
            print(f"✓ Deleted: {removed['task']}")
        else:
            print("Invalid task number!")

def main():
    manager = TaskManager()
    
    while True:
        print("\n=== Task Manager ===")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Complete Task")
        print("4. Delete Task")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ")
        
        if choice == "1":
            task = input("Enter task: ")
            priority = input("Enter priority (High/Normal/Low): ")
            manager.add_task(task, priority)
        elif choice == "2":
            manager.view_tasks()
        elif choice == "3":
            manager.view_tasks()
            task_num = int(input("Enter task number to complete: "))
            manager.complete_task(task_num)
        elif choice == "4":
            manager.view_tasks()
            task_num = int(input("Enter task number to delete: "))
            manager.delete_task(task_num)
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid choice!")

if __name__ == "__main__":
    main()

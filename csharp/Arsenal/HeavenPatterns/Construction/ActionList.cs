using System.Collections.Generic;

namespace HeavenPatterns.Construction
{
    public class ActionList<T> : IAction<T> where T : IActionContext
    {
        private List<IAction<T>> actions;

        public ActionList(IEnumerable<IAction<T>> actions)
        {
            this.actions = new List<IAction<T>>(actions);
        }

        public void Append(IAction<T> action)
        {
            this.actions.Add(action);
        }

        public T Execute(T carriedContext)
        {
            T context = carriedContext;
            foreach(IAction<T> action in actions)
            {
                if (!context.Success)
                {
                    return context;
                }
                context = action.Execute(context);
            }

            return context;
        }
    }
}

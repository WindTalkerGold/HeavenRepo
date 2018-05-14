using System;

namespace HeavenPatterns.Construction
{
    /// <summary>
    /// a context is the output of an action, and will be used as input of another
    /// </summary>
    public interface IActionContext
    {
        /// <summary>
        /// A bool indicates whether the context generation succeeded or not
        /// </summary>
        bool Success { get; set; }

        /// <summary>
        /// A string contains based contextual information of the context generation
        /// </summary>
        string Message { get; set; }

        /// <summary>
        /// A string indicates which action generates the context
        /// </summary>
        string ActionName { get; set; }
    }

    public static class ActionContextExtensions
    {
        public static IActionContext Exception(this IActionContext context, string actionName, Exception ex)
        {
            context.Success = false;
            context.Message = $"{ex.Message}{Environment.NewLine}{context.Message}";
            context.ActionName = actionName;
            return context;
        }

        public static IActionContext InitContext(this IActionContext context)
        {
            context.Success = true;
            context.ActionName = nameof(InitContext);
            return context;
        }
    }
}

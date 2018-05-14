
namespace HeavenPatterns.Construction
{
    public interface IAction<T> where T: IActionContext
    {
        T Execute(T carriedContext);
    }
}

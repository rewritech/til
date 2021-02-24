using System;

namespace Hello
{
    class MainApp
    {
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: Hello.exe <Name>");

            }
            Console.WriteLine("Hello {0}", args[0]);
        }
    }
}

#include <iostream>
#include <windows.h>
#include <string>
using namespace std;
int main()
{
	string arr[] = 
	{
		"傻逼", 
		"傻逼你还看",
		"傻逼你怎么还在看",
		"卧槽你看够了没啊",
		"再看我就不理你了~",
		"求别看了= =",
		"再看我就要格式化你C盘了！",
		"傻逼。。",
	};
	int counter = 0;
	int pos = 0; 
	int size = 8;
	
	SetConsoleTitle("我真的是一个病毒！");
	while (1) 
	{
		if (counter++ % 6 == 0) 
		{
			cout << arr[pos++];
			if (pos == size) {
				ShowWindow(GetConsoleWindow(), SW_HIDE);
				int msgboxID=MessageBox(NULL, "根据相关法律法规和政策，您所有电脑文件已被删除。","FBI WARNNING", MB_OKCANCEL | MB_DEFBUTTON2);
				while (msgboxID) 
				{
					msgboxID=MessageBox(NULL, "根据相关法律法规和政策，您所有电脑文件已被删除。","FBI WARNNING", MB_OKCANCEL | MB_DEFBUTTON2);
				}
			}
		}
		else 
		{
			cout << "...";
		}
		Sleep(1000);
	} 
	return 0;
} 

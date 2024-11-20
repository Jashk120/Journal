'use client'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { FaCalculator, FaChartBar, FaHome, FaUser } from "react-icons/fa"; 
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/UserButton";
import { usePathname } from 'next/navigation'

const Sidebar = () => {
 const currentPath = usePathname()
  return (
    <div className="mt-2 ml-4 flex flex-col bg-gradient-to-b from-gray-700 to-gray-900 w-64 text-gray-100 shadow-lg rounded-md p-4 mb-2">
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-500 to-gray-300 text-center drop-shadow-lg">
          Forex Journal
        </h1>
        <Separator className="my-2 w-4/5 border-t border-gray-500" />
      </div>
      
      {/* Menubar Navigation */}
      <Menubar className="flex flex-col flex-1 bg-transparent border-0 shadow-none space-y-2">
        <MenubarMenu>
        <Link 
            href="/home" 
            className={`flex ml-2 w-full rounded-full items-center p-4  text-gray-200 ${currentPath === '/home' ? 'bg-gray-500 text-white' : 'hover:bg-gray-500 hover:text-white'}`}

          >
            <FaHome className="mr-3" /> Home
          </Link>
        </MenubarMenu>

        <MenubarMenu>
          <Link 
            href="/trades" 
            className={`flex ml-2 w-full rounded-full items-center p-4  text-gray-200 ${currentPath === '/trades' ? 'bg-gray-500 text-white' : 'hover:bg-gray-500 hover:text-white'}`}

          >
            <FaUser className="mr-3" /> Trade
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link 
              href="/calculator" 
              className={`flex ml-2 w-full rounded-full items-center p-4  text-gray-200 ${currentPath === '/calculator' ? 'bg-gray-500 text-white' : 'hover:bg-gray-500 hover:text-white'}`}

            >
            <FaCalculator className="mr-3" /> Calculator
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link 
              href="/dashboard" 
              className={`flex ml-2 w-full rounded-full items-center p-4  text-gray-200 ${currentPath === '/dashboard' ? 'bg-gray-500 text-white' : 'hover:bg-gray-500 hover:text-white'}`}

            >
            <FaChartBar  className="mr-3" /> Dashboard
          </Link>
        </MenubarMenu>
      </Menubar>


      <div className="mt-4 flex justify-center"> {/* Center UserButton */}
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;

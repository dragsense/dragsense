import { Avatar, Dropdown } from 'antd';
import { signOut } from "next-auth/react";
import Link from 'next/link';

const getRandomColorCombination = () => {
  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  let bg = getRandomDarkColor();
  return bg;
};

const Nav = ({ user }) => {
  const onClick = ({ key }) => {
    if (key === "5") signOut();
  };

  const avatarColor = getRandomColorCombination();

  // Define items with conditional logic for admin users
  const items = [
    {
      key: '1',
      label: (
        <Link href="/admin/profile">
          Profile
        </Link>
      ),
    },
    ...(user.admin ? [
      {
        key: '2',
        label: (
          <Link href="/admin/users">
            Users
          </Link>
        ),
      },
      {
        key: '3',
        label: (
          <Link href="/admin/projects">
            Projects
          </Link>
        ),
      },
      {
        key: '4',
        label: (
          <Link href="/admin/train-model">
            Train Model
          </Link>
        ),
      },
    ] : []), // Only add these items if user.admin is true
    {
      key: '5',
      label: (
        <span>
          Sign out
        </span>
      ),
    }
  ];

  return (
    <nav className="nav-container">
      <div className="logo">
        <a href="/">
          <img src="/images/logo/nav-logo.png" alt="logo" style={{ width: 54 }} />
        </a>
      </div>

      <Dropdown menu={{ items, onClick }} style={{ textAlign: 'left' }}>
        <a onClick={e => e.preventDefault()}>
          {user.image ? (
            <Avatar size={30} src={user.image} alt={user.name} />
          ) : (
            <Avatar size={30} style={{ backgroundColor: avatarColor, color: '#fff' }}>
              {user.name[0]}
            </Avatar>
          )}
        </a>
      </Dropdown>
    </nav>
  );
};

export default Nav;

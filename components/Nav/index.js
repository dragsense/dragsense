import { Avatar, Dropdown } from 'antd';
import { signOut } from "next-auth/react"
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

const items = [
  {
    key: '1',
    label: (
      <Link
        href="/admin/profile"
      >
        Profile
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link
        href="/admin/projects"
      >
        Projects
      </Link>
    ),
  },
  {
    key: '3',
    label: (
      <span>
        Sign out
      </span>
    )
  }
]

const Nav = ({ user }) => {


  const onClick = ({ key }) => {

    if (key === "3")
      signOut();

  }

  const avatarColor = getRandomColorCombination();

  return (
    <nav className="nav-container">
      <div className="logo">
        <img src="/images/logo/nav-logo.png" alt="logo" style={{width: 54}} />
      </div>

      <Dropdown menu={{ items, onClick }} style={{ textAlign: 'left' }}>
        <a onClick={e => e.preventDefault()}>
          {user.image ?
            <Avatar size={30} src={user.image} alt={user.name} />
            : <Avatar size={30} style={{ backgroundColor: avatarColor.bg, color: '#fff' }}>
              {user.name[0]}
            </Avatar>}
        </a>
      </Dropdown>

    </nav>
  );

};

export default Nav;


import React from 'react'
import { Info, Repos, User, Search, Navbar } from '../components'
import loadingImage from '../images/preloader.gif'
import { useGLobalContext } from '../context/context'
const Dashboard = () => {
  const { loading } = useGLobalContext()
  if (loading) {
    return (
      <main>
        <Navbar />
        <Search />
        <img src={loadingImage} alt='Loading' className='loading-img' />
      </main>
    )
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search />
      <Info />
      <User />
      <Repos />
    </main>
  )
}

export default Dashboard

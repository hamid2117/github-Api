import React, { useState, useEffect, useContext } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState(0)
  const [error, setError] = useState({ show: false, msg: '' })
  const fetchingData = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequest(remaining)
        if (remaining === 0) {
          toggleError(true, 'Sorry , You have exeeded your hourly rate limit!')
        }
      })
      .catch((error) => console.log(error))
  }
  const getGithubUser = async (query) => {
    toggleError()
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${query}`).catch((err) =>
      console.log(err)
    )
    if (response) {
      setGithubUser(response.data)
      const { login, followers_url } = response.data

      Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((error) => console.log(error))
    } else {
      toggleError({ show: true, msg: 'There is no user with that username' })
    }
    fetchingData()
    setLoading(false)
  }
  useEffect(fetchingData, [])
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg })
  }
  return (
    <GithubContext.Provider
      value={{ loading, getGithubUser, githubUser, repos, followers, request }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export const useGLobalContext = () => {
  return useContext(GithubContext)
}

const rootUrl = 'https://api.github.com'
export { GithubContext, GithubProvider }

import React from 'react'
import styled from 'styled-components'
import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Job from './Job'
import PageBtnContainer from './PageBtnContainer'


const JobsContainer = () => {
  const {
    getJobs,
    jobs,
    isLoading,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,

  } = useAppContext()

  useEffect(() => {
    getJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ page, search, searchStatus, searchType, sort])
  
    if (isLoading) {
      return <Loading center />
    }
    if (jobs.length === 0) {
      return (
        <Wrapper>
          <h2>No jobs to display...</h2>
        </Wrapper>
      )
    }
    return (
      <Wrapper>
        <h5>
          {totalJobs} job{jobs.length > 1 && 's'} found
        </h5>
        <div className='jobs'>
          {jobs.map((job) => {
            return <Job key={job._id} {...job} /> // _id -> from MongoDB document passed into state, {...job} -> all other properties in the jobs state
          })}
        </div>
        {numOfPages > 1 && <PageBtnContainer />}
      </Wrapper>
    )
  }

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 992px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`

export default JobsContainer
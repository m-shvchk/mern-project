import { Outlet, Link } from 'react-router-dom' // Outlet component allows nested UI to show up when child routes are rendered 
import Wrapper from '../../assets/wrappers/SharedLayout'

const SharedLayout = () => {
  return (
    <Wrapper>
      <nav>
        <Link to='all-jobs'>all jobs</Link>
        <Link to='add-job'>add job</Link>
      </nav>
      <Outlet /> 
    </Wrapper>
  )
}

export default SharedLayout
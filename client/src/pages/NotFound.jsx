import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import SEO from '../components/SEO.jsx';

const NotFound = () => {
  return (
    <div className="py-20">
      <SEO 
        title="Page Not Found" 
        description="The page you are looking for does not exist on safetyc.in." 
        path="/404"
      />
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary" size="large" className="bg-orange-600 border-none">
              Back Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;

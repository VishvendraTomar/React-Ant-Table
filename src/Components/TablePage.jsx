import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Tag, Pagination, Spin, Button } from 'antd'; 
import { useLocation, useNavigate } from 'react-router-dom';
import "./table.css"
import axios from 'axios'; 
import Navbar from './Navbar';
const { Option } = Select;

const TablePage  = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true); 
      const skip = (pagination.current - 1) * pagination.pageSize;
      const limit = pagination.pageSize;
      const tagsParam = filters.length > 0 ? `&tags=${filters.join(',')}` : '';
      const searchParam = searchText ? `&search=${searchText}` : '';
      const url = `https://dummyjson.com/posts?skip=${skip}&limit=${limit}${tagsParam}${searchParam}`;
      const response = await axios.get(url); 
      const data = response.data;
      setPosts(data.posts);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: data.total 
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('page', pagination.current);
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleSelectTag = (selectedTags) => {
    setFilters(selectedTags);
    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1 
    }));
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('tags', selectedTags.join(','));
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1 
    }));
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('search', value);
    navigate(`?${newQueryParams.toString()}`);
  };
  const handleReset = () => {
    setFilters([]);
    setSearchText('');
    // setPagination({ current: 1, pageSize: 10, total: 0 });
    updateURLWithFiltersAndSearch([], '');
  };

  const filteredPosts = posts.filter(post => {
    const tagMatches = filters.length === 0 || filters.every(filter => post.tags.includes(filter));
    const textMatches = searchText === '' || post.body.toLowerCase().includes(searchText.toLowerCase());
    return tagMatches && textMatches;
  });

  return (
    <div style={{ padding: '20px' }} >
      <div className='mainnav'>
        <Navbar/>
      </div>
      <div className='selectsection' style={{display:"flex",gap:"20px", padding:"20px"}}>
        <Input.Search
          placeholder="Search posts"
          onSearch={handleSearch}
          className='select'
        />
        <Button className='select' onClick={handleReset}>reset</Button>
        <Select
          mode="multiple"
          placeholder="Select tags"
          style={{ width: 250 }}
          className='select'
          onChange={handleSelectTag}
          value={filters}
        >
          <Option value="history">history</Option>
          <Option value="crime">crime</Option>
          <Option value="mystery">mystery</Option>
        </Select>
      </div>
      <div className='table'>
        <Spin spinning={loading} tip="Loading..."> 
          <Table
            dataSource={filteredPosts}
            columns={[
              { 
                title: 'ID', 
                dataIndex: 'id', 
                key: 'id', 
                render: (text, record) => (
                  <span style={{ color: 'black', padding:"5px" }}>{text}</span> 
                ) 
              },
              { 
                title: 'Title', 
                dataIndex: 'title', 
                key: 'title', 
                render: (text, record) => (
                  <span style={{ fontWeight: 'bold' }}>{text}</span> 
                ) 
              },
              { title: 'Body', dataIndex: 'body', key: 'body' },
              { 
                title: 'Tags', 
                dataIndex: 'tags', 
                key: 'tags', 
                render: tags => (
                  <>
                    {tags.map(tag => {
                      let color = '';
                      if (tag === 'history') {
                        color = '#1554ad'; 
                      } else if (tag === 'crime') {
                        color = '#e84749';
                      } else if (tag === 'mystery') {
                        color = '#6abe39';
                      }else  {
                        color = '#84e2d8';
                      }
                      return (
                        <Tag color={color} key={tag} >{tag} </Tag>
                      );
                    })}
                  </>
                )
              }
            ]}
            scroll={{ }}
            pagination= {pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </div>
    </div>
  );
};

export default TablePage;

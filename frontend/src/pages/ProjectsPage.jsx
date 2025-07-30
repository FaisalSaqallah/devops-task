import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: null, role: '', name: '', email: '' });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id || null,
          role: payload.role || '',
          name: payload.name || '',
          email: payload.email || ''
        });
      } catch (e) {
        console.error("Invalid token:", e);
      }
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/projects', {
        headers: {
          'X-App-Check': 'vtask2901'
        }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (editingProjectId) {
        await axios.put(`http://localhost:3000/projects/${editingProjectId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-App-Check': 'vtask2901'
          }
        });
      } else {
        await axios.post('http://localhost:3000/projects', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-App-Check': 'vtask2901'
          }
        });
      }
      setFormData({ title: '', description: '' });
      setEditingProjectId(null);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleEdit = (project) => {
    setFormData({ title: project.title, description: project.description });
    setEditingProjectId(project.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-App-Check': 'vtask2901'
        }
      });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className="container">
      <h2>Projects</h2>
      {(user.name || user.email) && user.role && (
        <p>
          Welcome, {user.name || user.email} ({user.role})
        </p>
      )}
     
      <form onSubmit={handleCreateOrUpdate}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingProjectId ? 'Update Project' : 'Create Project'}
        </button>
      </form>

      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <div className="project-title"> <h3>Title: {project.title}</h3> </div>
          <div className="project-meta">
           <h3>by:  {project.user?.name} ({project.user?.email})</h3>
          </div>
             <h3> Discription:</h3>
          <div>{project.description}</div>
     
          {(user.id === project.user?.id || user.role === 'ADMIN') && (
            <div className="project-actions">
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
       <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>
        Logout
      </button>
    </div>
    
  );
}

export default ProjectsPage;
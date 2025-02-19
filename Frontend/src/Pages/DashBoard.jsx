
import { useUser } from '@clerk/clerk-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CreateProjectSection from '../components/CreateProjectButton';
import ProjectCard from '@/components/ProjectCard';

const DashBoard = () => {

    const { user,isLoaded } = useUser();
    const [projects, setProjects] = useState([]);

    const navi = useNavigate();

    useEffect(() => {
      const checkUserExists = async () => {
         
              const userData = {
                  email: user?.primaryEmailAddress.emailAddress
              }
              
              try {
                console.log("This is the user data",userData);
                  const response = await axios.post('http://localhost:3000/checkifuserexists',userData);
                  console.log(response.data)

                  if (response.data.message === 'User does not exist in database') {
                      console.log("It worked")
                      // navi('/Onboarding')
                  }
              } catch (error) {
                  console.error('Error checking user existence:', error)
              }
          
      }

      
          checkUserExists();
          const fetchProjects = async () => {
            const res = await axios.post("http://localhost:3000/getProjectsbyClerkID", {
              Clerk_id: user.id,
            });
      
            const projectIds = res.data.createdProjects;
            console.log(projectIds);
            const projectPromises = projectIds.map(async (projectId) => {
              const projectData = await axios.post("http://localhost:3000/getprojectByID", {
                id: projectId,
              });
              return projectData.data.reqproject;
            });
      
            const fetchedProjects = await Promise.all(projectPromises);
            setProjects(fetchedProjects);
          };
        fetchProjects();
      
  }, [user,navi]);

  if (!isLoaded) {
    return <h1>Loading...</h1>
}





 

  return (
    <>

<div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-center mt-4">Welcome, {user?.fullName}!</h1>
            <p className="text-lg mt-2">You are logged in as Freelancer.</p>
            <header className="mt-8">
                
                <CreateProjectSection />
                <h1>{user?.primaryEmailAddress.emailAddress}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard
                key={index}
                name={project.title}
                tags={project.tags}
                experienceLevel={project.experienceLevel}
                price={project.price}
                onViewProject={() => alert(`Viewing project details for ${project.title}`)}
              />
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
              
            </header>
        </div>

    
    
    </>
  )
}

export default DashBoard
import GithubSocialButton from '@/Components/GithubSocialButton/GithubSocialButton';

interface CollaboratorToProjectProps {
  [key: string]: string;
}

const Collaborators: React.FC<{
  collaboratorToProject: CollaboratorToProjectProps[];
}> = ({ collaboratorToProject }) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      <b>Collaborators</b>
      <ul className="list-dist flex flex-col items-start justify-start gap-2 text-gray-400">
        {collaboratorToProject.map(
          (collaborator: CollaboratorToProjectProps) => (
            <li
              key={collaborator.name}
              className="justify-stat flex items-start gap-4"
            >
              <GithubSocialButton to={collaborator.githubProfileLink} />
              <p>{collaborator.name}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Collaborators;

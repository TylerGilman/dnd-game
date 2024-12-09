import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from '../components/RegisterForm';
import { 
  TavernSign, 
  CabinDoor,
  CabinStructure, 
  ForestBackground 
} from '../components/theme/CabinExterior';
import { NPCDialog } from '../components/theme/NPCDialog';
import { Snowfall } from '../components/theme/SnowEffects';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ForestBackground>
      <Snowfall />
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl space-y-8">
          <NPCDialog>
            *A raspy voice emanates through the thick wooden door*
            <br /><br />
            "Eh? A new face at the door? Well then, can't be too careful these days... 
            Tell us about yerself before we let ye in. And speak up, it's quite the storm out there!"
          </NPCDialog>

          <CabinStructure>
            <CabinDoor>
              <RegisterForm onSuccess={() => {
                navigate('/dashboard');
              }} />
            </CabinDoor>
          </CabinStructure>

        <p className="text-center text-[#DEB887] font-serif mt-4 text-lg">
          Already a regular?{' '}
          <Link 
            to="/login"
            className="font-bold text-[#2c1810] underline underline-offset-4 hover:text-[#8B4513] transition-colors duration-300"
          >
            *Step right up to the door*
          </Link>
        </p>
        </div>
      </div>
    </ForestBackground>
  );
};

export default RegisterPage;

import { Icon, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const HeaderMenuItem = ({ url, label, icon }) =>{
    return(
        <Link
           as={RouterLink}
           to={url}
           fontsize='sm'
           letteSpacing='wide'
           textTransform='uppercase'
           mr='5'
           dispaly='flex'
           alignItems='center'
           fontWeight='semibold'
           color='whiteAlpha.800'
           mt={{ base: '2', md:'0'}}
           _hover={{textDecor:'none', opacity:'0.7' }}>
            <Icon as={icon} mr='1' w='4' h='4'/>
            {label}
        </Link>
    );
};

export default HeaderMenuItem;
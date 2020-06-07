import React, {useState, useEffect} from 'react';
import { ImageBackground, 
         View, 
         Image, 
         StyleSheet, 
         Text, 
         TextInput, 
         KeyboardAvoidingView,
         Platform,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'
import PickerSelect from 'react-native-picker-select';
import {Feather as Icon, Ionicons as IconArrow} from '@expo/vector-icons';
import {RectButton} from 'react-native-gesture-handler';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const Home = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  function handleSelectUf(uf: string) {
    setSelectedUf(uf);
  }

  function handleSelectCity(city: string) {
    setSelectedCity(city);
  }

  return (
  <KeyboardAvoidingView 
    style={{flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{width: 274, height: 368}}
      >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
          <Text style={styles.title} >Seu market place de coleta de resíduos</Text>
          <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
        </View>
      </View>

      <View style={styles.footer}>

      <PickerSelect
            placeholder={{ label: "Selecione a UF", value: '0' }}
            style={pickerSelectStyles}
            value={selectedUf}
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => handleSelectUf(value)}
            Icon={() => {
              return <IconArrow name="md-arrow-dropdown" size={24} color="gray" />;      
            }}
            items={ufs.map(uf => (
              {label: uf, value: uf, key: uf}
            ))}
      />

      <PickerSelect
            placeholder={{ label: "Selecione a Cidade", value: '0' }}
            style={pickerSelectStyles}
            value={selectedCity}
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => handleSelectCity(value)}
            Icon={() => {
              return <IconArrow name="md-arrow-dropdown" size={24} color="gray" />;      
            }}
            items={cities.map(city => (
              {label: city, value: city, key: city}
            ))}
      />

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingRight: 30,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  iconContainer: {
    top: 17,
    right: 15,
  },
});

export default Home;
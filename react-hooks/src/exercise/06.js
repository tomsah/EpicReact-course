// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function fetchDataReducer(state, action) {
  switch (action.type) {
    case 'ERROR': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
      }
    }
    case 'SUCCESS': {
      return {
        ...state,
        status: 'resolved',
        data: action.data,
      }
    }
    case 'STARTED': {
      return {
        ...state,
        status: 'pending',
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useFetchData(name) {
  const [state, dispatch] = React.useReducer(fetchDataReducer, {
    status: name ? 'pending' : 'idle',
    error: null,
    data: null,
  })

  React.useEffect(() => {
    if (!name) {
      dispatch({
        type: 'ERROR',
        error: '',
      })
    }
    dispatch({type: 'STARTED'})
    fetchPokemon(name).then(
      pokemonData => dispatch({type: 'SUCCESS', data: pokemonData}),
      error => dispatch({type: 'ERROR', error}),
    )
  }, [name])
  return state
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const {status, data, error} = useFetchData(pokemonName)
  if (!pokemonName) {
    return 'Submit a pokemon'
  }

  if (status === 'idle' || status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  if (status === 'rejected') {
    throw error
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

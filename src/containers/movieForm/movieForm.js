import React, { Component } from 'react';
import './movieForm.css';
import { Button, Modal, FormControl, FormGroup, ControlLabel, HelpBlock, Grid, Row, Col } from 'react-bootstrap';

import { graphql, compose, withApollo } from 'react-apollo';
import { addMovie, updateMovie } from '../../mutations/movies';

/* 

  FILM EXAMPLE:

  Interestellar

  https://jaumecentelles.files.wordpress.com/2016/05/1-cartel-de-interstellar.jpg?w=210&h=300

  Interstellar es una película épica de ciencia ficción estadounidense de 2014, 
  dirigida por Christopher Nolan y protagonizada por Matthew McConaughey, Anne Hathaway, 
  Jessica Chastain, Michael Caine y Matt Damon.

  2014

  9
*/

class MovieForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      form: {
        id: '',
        title: '',
        description: '',
        poster_image: '',
        year: '',
        rating: '',
      },
    }
  }

  componentWillReceiveProps = () =>{
    if (this.props.movie) return this.setState({form: this.props.movie });
  }


  // ## Form controllers: Controlan el estado del formulario y muestran mensajes 
  // ## si los datos introducidos no son válidos

  getValidationTitleState = () => {
    const length = this.state.form.title.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    else return 'warning';
  };

  getValidationDescriptionState = () => {
    const length = this.state.form.description.length;
    if (length > 80) return 'success';
    else if (length > 50) return 'warning';
    else if (length > 0) return 'error';
    else return 'warning';
  };

  getValidationYearState = () => {
    const value = this.state.form.year;
    if (!value) return 'warning';
    else if (value > new Date().getFullYear()) return 'error'; 
    else return 'success';
  };

  getValidationRatingState = () => {
    const value = this.state.form.rating;
    if (!value) return 'warning';
    else if (value < 0 || value > 10 ) return 'error'; 
    else return 'success';
  };


  // ## Form handlers: Actualizan el estado del formulario cada vez que un valor del formulario cambia
  handleFormChange = event  => {
    let newForm = {...this.state.form};
    newForm[event.target.id] = event.target.value;
    this.setState({form: newForm });
  }

  // Create button
  create = ({title, description, poster_image, year, rating}) => {
    this.props.addMovie({ title, description, poster_image, year, rating });
    this.props.onHide();
  }

  // Update button

  // A diferencia de create, necesitamos el ID para poder actualizar una película
  update = ({id, title, description, poster_image, year, rating}) => {
    this.props.updateMovie({ id, title, description, poster_image, year, rating });
    this.props.onHide();
  }

  render() {
    return (
        // Las props vienen del container movies.js y controlan si mostrar o no el formulario
        <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="formModal">
          <Modal.Header closeButton>
            <Modal.Title>New movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
          <Grid style={{ width: '100%'}}>
              <Row >
                <Col xs={6} md={8}>  
                  <FormGroup
                    controlId="title"
                    validationState={this.getValidationTitleState()}
                  >
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                      type="text"
                      value={this.state.form.title}
                      placeholder="Title"
                      onChange={this.handleFormChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>More than 5 characters</HelpBlock>
                  </FormGroup>


                  { /* Description */}
                  <FormGroup
                    controlId="description"
                    validationState={this.getValidationDescriptionState()}
                  >
                    <ControlLabel>Description</ControlLabel>
                    <FormControl
                      type="text"
                      componentClass="textarea"
                      value={this.state.form.description}
                      placeholder="Description"
                      onChange={this.handleFormChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>More than 50 characters</HelpBlock>
                  </FormGroup>

                  { /* Year */}
                  <FormGroup
                    controlId="year"
                    validationState={this.getValidationYearState()}
                  >
                    <ControlLabel>Year</ControlLabel>
                    <FormControl
                      type="number"
                      value={this.state.form.year}
                      placeholder="Year"
                      onChange={this.handleFormChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Cannot add films that has been not released</HelpBlock>
                  </FormGroup>


                  { /* Rating */}
                  <FormGroup controlId="rating" validationState={this.getValidationRatingState()} >
                    <ControlLabel>Rating</ControlLabel>
                    <FormControl
                      type="number"
                      value={this.state.form.rating}
                      placeholder="Rating"
                      onChange={this.handleFormChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>0 - 10</HelpBlock>
                  </FormGroup>
                </Col>
                <Col xs={12} md={4}>
                  <FormGroup controlId="poster_image" >
                    <ControlLabel>Poster</ControlLabel>
                    <FormControl
                      type="text"
                      value={this.state.form.poster_image}
                      placeholder="Poster image url"
                      onChange={this.handleFormChange}
                    />
                  </FormGroup>
                  <div className="posterImagePreview" >
                    { this.state.form.poster_image && 
                      <img src={this.state.form.poster_image} alt="Poster" width="200px" height="250px" />
                    }
                  </div>
                </Col>
              </Row>
          </Grid>            
          </form>
         </Modal.Body>

          <Modal.Footer>

            {/* Si recibo una película por props, estoy editando. Si no, estoy creando */}
            { this.props.movie &&
              <Button className="baseButton" onClick={ () => this.update(this.state.form)}>Update</Button>
            }
            { !this.props.movie &&
              <Button className="baseButton" onClick={ () => this.create(this.state.form)}>Create</Button>
            }
          </Modal.Footer>
        </Modal>
    );
  }
}

const addMovieMutation = graphql(addMovie, {
  props: ({ mutate }) => ({
    addMovie: ({ title, description, poster_image, year, rating }) =>
      mutate({
        variables: { title, description, poster_image, year, rating },
      }),
  }),
  options: {
    refetchQueries: [
      'allMovies',
    ],
  },
});


const updateMovieMutation = graphql(updateMovie, {
  props: ({ mutate }) => ({
    updateMovie: ({ id, title, description, poster_image, year, rating}) =>
      mutate({
        variables: { id, title, description, poster_image, year, rating },
      }),
  }),
  options: {
    refetchQueries: [
      'allMovies',
    ],
  },
});

export default compose(
  addMovieMutation,
  updateMovieMutation,
  withApollo,
)(MovieForm);
import React, { Component } from 'react'
import SearchForm from '../components/forms/searchForm.component'

import SideNav from '../components/navigation/navbar.component'
import StaticNav from '../components/navigation/staticnav.component'
import '../styles/pages/search.page.scss'

export default class Search extends Component {
  render() {
    return (
      <>
        <SideNav />
        <div id="main">
        <SearchForm />
        </div>
      </>
    )
  }
}


import { Component, OnInit } from '@angular/core';
import { NavService } from './nav.component.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  name: string = '';
  movies: any[] = [];
  favorites: any[] = [];
  showFavorites: boolean = false;
  http: any;

  constructor(private navService: NavService) { }

  ngOnInit(): void {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  getMovie(event: any) {
    this.name = event.target.value;
    if (this.name) {
      this.navService.getMovieData(this.name).subscribe({
        next: (data: any[]) => {
          this.movies = data;
          this.updateMovieDetails();
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  updateMovieDetails() {
    for (let movie of this.movies) {
      this.navService.getMovieDetails(movie.imdbID).subscribe((details: any) => {
        movie.Actors = details.Actors;
        movie.Plot = details.Plot;
        movie.Ratings = details.Ratings;
      });
    }
  }

  addToFavorites(movie: any) {
    const index = this.favorites.findIndex((fav) => fav.imdbID === movie.imdbID);
    if (index === -1) {
      this.favorites.push(movie);
    } else {
      this.favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
  }

  isFavorite(movie: any): boolean {
    return this.favorites.some((fav) => fav.imdbID === movie.imdbID);
  }

  getMoviesToDisplay(): any[] {
    return this.showFavorites ? this.favorites : this.movies;
  }

  getTooltipText(movie: any): string {
    return this.isFavorite(movie) ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  }
}


  $('#home-slides').owlCarousel({
    loop: true,
    margin: 10,
    animateOut: 'fadeOut',
    autoplayTimeout: 3000,
    autoplay: true,
    dots: false,
    navigation: false,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  })

  $('#financila-sl').owlCarousel({
    loop: true,
    margin: 10,
    animateOut: 'fadeOut',
    autoplayTimeout: 3000,
    autoplay: true,
    dots: true,
    navigation: true,
    nav: true,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 8
      }
    }
  })

  $('#Customer').owlCarousel({
    loop: true,
    margin: 10,
    animateOut: 'fadeOut',
    autoplayTimeout: 3000,
    autoplay: true,
    dots: true,
    navigation: true,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 2
      }
    }
  })


  $('#VLEs').owlCarousel({
    loop: true,
    margin: 10,
    animateOut: 'fadeOut',
    autoplayTimeout: 3000,
    autoplay: true,
    dots: true,
    navigation: true,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 2
      }
    }
  })


  $('#Partner').owlCarousel({
    loop: true,
    margin: 10,
    animateOut: 'fadeOut',
    autoplayTimeout: 3000,
    autoplay: true,
    dots: true,
    navigation: true,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 2
      }
    }
  })


   $('#information').owlCarousel({
      loop: true,
      margin: 10,
      animateOut: 'fadeOut',
      autoplayTimeout: 3000,
      autoplay: true,
      dots: true,
      navigation: true,
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 4
        }
      }
    })





  $(document).ready(function(){
      $('#home-slides').owlCarousel({
          items: 1,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true
      });
  });


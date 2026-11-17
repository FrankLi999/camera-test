## Test 1 - fundamental

    start with "/" -> "/photo-permission/use-camera" -> "/photo-permission/use-camera2" -> "/"

## Test 2 - mobx

use <i>mobx</i> store keep track Google mediapipe status

    start with "/mobx" -> "/mobx/use-camera" -> "/mobx/use-camera2" -> "/mobx"


## Test 3 - zustand

use <i>zustand</i> store keep track Google mediapipe status

    start with "/zustand" -> "/zustand/use-camera" -> "/zustand/use-camera2" -> "/zustand"    

## Test 3 - React context

use <i>React context</i> store keep track Google mediapipe status

    start with "/context-provider" -> "/context-provider/use-camera" -> "/context-provider/use-camera2" -> "/context-provider"


## Notes

- stop camera

   <i>stopCamera</i> at "Next" button event handler instead of via useEffect return function.

- Firefox url to test Camera - getUserMedia

  [gUM Test Page](https://mozilla.github.io/webrtc-landing/gum_test.html)

  
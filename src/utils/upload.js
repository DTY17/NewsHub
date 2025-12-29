// Import the Cloudinary class
import { Cloudinary } from "@cloudinary/url-gen";
// Import the resize transformation and apply it to myImage
// import { Resize } from "@cloudinary/url-gen/actions/resize";

export default upload = () => {
  // Create your instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: "demo",
    },
    url: {
      secure: true, // force https, set to false to force http
    },
  });

  // Let's create a new image
  const myImage = cld.image("sample");

  // Resize the image to 100x100
  // myImage.resize(Resize.scale().width(100).height(100));

  // When we're done, we can apply all our changes and create a URL.
  const myURL = myImage.toURL();

  // https://res.cloudinary.com/demo/image/upload/c_scale,w_100,h_100/sample
  console.log(myURL);
};

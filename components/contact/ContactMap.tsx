export default function ContactMap() {
  return (
    <section className="map-section reveal">
      <div className="map-wrap">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39735.61793744654!2d-0.1277583!3d51.5073509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ce176ac979%3A0x42af85654e23a0b4!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
          width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </section>
  );
}

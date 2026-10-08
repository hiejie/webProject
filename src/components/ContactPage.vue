<template>
  <div class="contact">
    <div class="row">
      <div class="col-lg-7 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h2 class="h4 font-weight-bold text-primary mb-3">Send a Message</h2>
            <p class="text-muted small mb-4">Have questions regarding this FIN-LAB-1 activity? Fill in the details below.</p>

            <div v-if="submitted" class="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Thank you, {{ form.name }}!</strong> Your message has been received successfully.
              <button type="button" class="close" @click="submitted = false">&times;</button>
            </div>

            <div
              v-if="errorMessage"
              class="alert alert-danger"
              role="alert"
            >
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="form-group mb-3">
                <label class="font-weight-bold small">Full Name</label>
                <input type="text" class="form-control" v-model="form.name" placeholder="John Doe" required>
              </div>

              <div class="form-group mb-3">
                <label class="font-weight-bold small">Email Address</label>
                <input type="email" class="form-control" v-model="form.email" placeholder="student@example.com" required>
              </div>

              <div class="form-group mb-3">
                <label class="font-weight-bold small">Subject</label>
                <select class="form-control" v-model="form.subject">
                  <option>Lab Question</option>
                  <option>Bug Report</option>
                  <option>Submission Inquiry</option>
                </select>
              </div>

              <div class="form-group mb-4">
                <label class="font-weight-bold small">Message</label>
                <textarea class="form-control" rows="4" v-model="form.message" placeholder="Type your message here..." required></textarea>
              </div>

              <button
                type="submit"
                class="btn btn-primary font-weight-bold px-4"
                :disabled="loading"
              >
                {{ loading ? 'Sending...' : 'Submit Inquiry' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Contact Info Sidebar -->
      <div class="col-lg-5 mb-4">
        <div class="card shadow-sm border-0 bg-light h-100">
          <div class="card-body p-4">
            <h3 class="h5 font-weight-bold mb-3">Lab Helpdesk</h3>
            <p class="text-muted small mb-4">Contact your course instructor or laboratory assistants during consultation hours.</p>

            <div class="d-flex mb-3">
              <div class="mr-3 text-primary"><i class="fas fa-map-marker-alt fa-lg"></i></div>
              <div>
                <strong class="d-block small">Computer Laboratory:</strong>
                <span class="text-muted small">Tech Building, Room 402</span>
              </div>
            </div>

            <div class="d-flex mb-3">
              <div class="mr-3 text-primary"><i class="fas fa-envelope fa-lg"></i></div>
              <div>
                <strong class="d-block small">Email Inquiries:</strong>
                <span class="text-muted small">weblab@university.edu</span>
              </div>
            </div>

            <div class="d-flex">
              <div class="mr-3 text-primary"><i class="fas fa-clock fa-lg"></i></div>
              <div>
                <strong class="d-block small">Consultation Hours:</strong>
                <span class="text-muted small">Mon - Fri: 9:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ContactPage',

  data () {
    return {
      submitted: false,
      loading: false,
      errorMessage: '',

      form: {
        name: '',
        email: '',
        subject: 'Lab Question',
        message: ''
      }
    }
  },

  methods: {
    async handleSubmit () {
      this.submitted = false
      this.errorMessage = ''
      this.loading = true

      try {
        const response = await fetch(
          'http://localhost:5000/api/contact',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || 'Failed to submit your message.'
          )
        }

        this.submitted = true

        // Reset the form after a successful submission
        this.form = {
          name: '',
          email: '',
          subject: 'Lab Question',
          message: ''
        }
      } catch (error) {
        this.errorMessage =
          error.message || 'Unable to connect to the backend.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


<style scoped>
.contact {
  padding-bottom: 20px;
}
</style>

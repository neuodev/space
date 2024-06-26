export const messages = {
  pages: {
    register: {
      form: {
        title: "page.register.form.title",
        name: {
          label: "page.register.form.name.label",
          placeholder: "page.register.form.name.placeholder",
        },
        button: {
          label: "page.register.form.button.submit.label",
        },
      },
    },
    login: {
      form: {
        title: "page.login.form.title",
        button: {
          label: "page.login.form.button.submit.label",
        },
      },
    },
    select: {
      type: {
        title: "page.select.type.title",
        options: {
          tutor: "page.select.type.options.tutor",
          student: "page.select.type.options.student",
        },
      },
      gender: {
        title: "page.select.gender.title",
      },
    },
  },
  errors: {
    invalid: "errors.invalid",
    required: "errors.required",
    name: {
      length: {
        short: "errors.name.length.short",
        long: "errors.name.length.long",
      },
      arabic: "errors.name.arabic",
    },
    email: { invalid: "errors.email.invlaid" },
    password: { invalid: "errors.password.invlaid" },
  },
  global: {
    form: {
      email: {
        label: "global.form.email.label",
        placeholder: "global.form.email.placeholder",
      },
      password: {
        label: "global.form.password.label",
      },
    },
    logout: "global.logout",
  },
} as const;

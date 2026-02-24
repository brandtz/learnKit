<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <HelpCircle class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Knowledge Check</h2>
    </div>

    <div class="space-y-6">
      <div
        v-for="(q, qi) in questions"
        :key="qi"
        class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
      >
        <p class="font-medium text-gray-900 dark:text-gray-100 mb-3">
          {{ qi + 1 }}. {{ q.question }}
        </p>

        <!-- True/False -->
        <div v-if="q.type === 'true_false'" class="flex gap-3">
          <button
            v-for="opt in [true, false]"
            :key="String(opt)"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            :class="getOptionClass(qi, opt)"
            :disabled="submitted"
            @click="answers[qi] = opt"
          >
            {{ opt ? 'True' : 'False' }}
          </button>
        </div>

        <!-- Multiple choice -->
        <div v-else class="space-y-2">
          <button
            v-for="(opt, oi) in q.options"
            :key="oi"
            class="w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors"
            :class="getOptionClass(qi, oi)"
            :disabled="submitted"
            @click="answers[qi] = oi"
          >
            {{ opt }}
          </button>
        </div>

        <!-- Result feedback -->
        <div v-if="submitted" class="mt-3 flex items-start gap-2">
          <CheckCircle v-if="isCorrect(qi)" class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <XCircle v-else class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ q.explanation }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex gap-3">
      <button
        v-if="!submitted"
        class="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
        :disabled="!allAnswered"
        :class="{ 'opacity-50 cursor-not-allowed': !allAnswered }"
        @click="submitted = true"
      >
        Check Answers
      </button>
      <button
        v-if="submitted"
        class="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg px-6 py-2 text-sm font-medium transition-colors"
        @click="resetQuiz"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { HelpCircle, CheckCircle, XCircle } from 'lucide-vue-next'

const props = defineProps({
  questions: { type: Array, default: () => [] }
})

const answers = ref({})
const submitted = ref(false)

const allAnswered = computed(() => {
  return props.questions.every((_, i) => answers.value[i] !== undefined)
})

function isCorrect(qi) {
  const q = props.questions[qi]
  return answers.value[qi] === q.correct
}

function getOptionClass(qi, value) {
  const selected = answers.value[qi] === value
  const q = props.questions[qi]

  if (!submitted.value) {
    return selected
      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-600'
      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
  }

  const isCorrectAnswer = value === q.correct
  if (isCorrectAnswer) {
    return 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-600'
  }
  if (selected && !isCorrectAnswer) {
    return 'border-red-400 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600'
  }
  return 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500'
}

function resetQuiz() {
  answers.value = {}
  submitted.value = false
}
</script>

class Rand
  @random: (opts) =>
    {min, max} = opts
    Math.floor(Math.random() * (max - min + 1) + min)

  @unique_random: (opts) =>
    {quantity, min, max} = opts
    if numbers > (max - min + 1) then return []

    results = []
    numbers = [min..max]
    while quantity > 0
      selected = @random min: 0, max: (numbers.length - 1)

      temp = numbers[0]
      numbers[0] = numbers[selected]
      numbers[selected] = temp

      results.push numbers.shift()
      quantity--

    return results

window.Rand = Rand